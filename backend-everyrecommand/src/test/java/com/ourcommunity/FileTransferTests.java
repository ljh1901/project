package com.ourcommunity;

import java.nio.file.*;
import java.util.Map;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.util.unit.DataSize;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.ourcommunity.common.ApiExceptionHandler;
import com.ourcommunity.controller.common.FileController;
import com.ourcommunity.service.common.impl.FileServiceImpl;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class FileTransferTests {
    @TempDir Path directory;
    FileServiceImpl service;
    MockMvc mvc;

    @BeforeEach
    void setUp() {
        service = new FileServiceImpl(directory.toString(), DataSize.ofMegabytes(20));
        mvc = MockMvcBuilders.standaloneSetup(new FileController(service))
                .setControllerAdvice(new ApiExceptionHandler()).build();
    }

    @Test
    void uploadReturnsMetadataAndDownloadPreservesBytesAndKoreanName() throws Exception {
        byte[] bytes = "sample document".getBytes(java.nio.charset.StandardCharsets.UTF_8);
        var file = new MockMultipartFile("file", "테스트.pdf", "application/pdf", bytes);
        var principal = UsernamePasswordAuthenticationToken.authenticated("alice", null, java.util.List.of());
        mvc.perform(multipart("/api/upload/fileUpload").file(file).principal(principal))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fileName").value("테스트.pdf"))
                .andExpect(jsonPath("$.data.size").value(bytes.length));
        String id;
        try (var paths = Files.list(directory)) {
            id = paths.findFirst().orElseThrow().getFileName().toString();
        }
        mvc.perform(get("/api/upload/fileDownload/" + id).principal(principal))
                .andExpect(status().isOk())
                .andExpect(content().bytes(bytes))
                .andExpect(header().string("Content-Type", "application/octet-stream"))
                .andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("attachment")));
        // 서비스 재생성 후에도 소유자와 원본 이름을 유지해야 합니다.
        var restarted = new FileServiceImpl(directory.toString(), DataSize.ofMegabytes(20));
        assertThat(restarted.fileDownload(id, "alice").get("fileName")).isEqualTo("테스트.pdf");
    }

    @Test
    void anotherOwnerAndMissingFileReturn404() throws Exception {
        Map<String, Object> result = service.fileUpload(
                new MockMultipartFile("file", "test.xlsx", null, new byte[]{1}), "alice");
        var principal = UsernamePasswordAuthenticationToken.authenticated("bob", null, java.util.List.of());
        mvc.perform(get("/api/upload/fileDownload/" + result.get("fileId")).principal(principal))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/upload/fileDownload/" + java.util.UUID.randomUUID()).principal(principal))
                .andExpect(status().isNotFound());
    }

    @Test
    void rejectsEmptyAndUnsafeNamesAndInvalidId() {
        for (String name : new String[]{"../bad.pdf", "C:\\bad.pdf", "bad\r\n.pdf", ".."}) {
            assertThatThrownBy(() -> service.fileUpload(
                    new MockMultipartFile("file", name, null, new byte[]{1}), "alice"))
                    .isInstanceOf(IllegalArgumentException.class);
        }
        assertThatThrownBy(() -> service.fileUpload(
                new MockMultipartFile("file", "empty.pdf", null, new byte[0]), "alice"))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> service.fileDownload("../secret", "alice"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void oversizedStreamIsRejectedAndPartialFilesAreRemoved() throws Exception {
        service = new FileServiceImpl(directory.toString(), DataSize.ofBytes(2));
        var file = new MockMultipartFile("file", "test.pdf", null, new byte[]{1, 2, 3}) {
            @Override public long getSize() { return 1; }
        };
        assertThatThrownBy(() -> service.fileUpload(file, "alice"))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class)
                .satisfies(error -> assertThat(((org.springframework.web.server.ResponseStatusException) error)
                        .getStatusCode().value()).isEqualTo(413));
        try (var paths = Files.list(directory)) {
            assertThat(paths.count()).isZero();
        }
    }

    @Test
    void duplicateOriginalNamesDoNotOverwriteFiles() throws Exception {
        var first = service.fileUpload(new MockMultipartFile("file", "same.pdf", null, new byte[]{1}), "alice");
        var second = service.fileUpload(new MockMultipartFile("file", "same.pdf", null, new byte[]{2}), "alice");
        assertThat(first.get("fileId")).isNotEqualTo(second.get("fileId"));
        var resource = (org.springframework.core.io.Resource) service.fileDownload(
                (String) first.get("fileId"), "alice").get("resource");
        assertThat(resource.getContentAsByteArray()).containsExactly((byte) 1);
    }
}