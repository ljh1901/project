package com.ourcommunity.config;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.env.MockEnvironment;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FrontendDevServerTests {
    @TempDir Path directory;

    private MockEnvironment environment() {
        return new MockEnvironment()
                .withProperty("app.frontend.directory", directory.toString())
                .withProperty("app.frontend.node-executable", "node")
                .withProperty("app.frontend.dev-host", "127.0.0.1")
                .withProperty("app.frontend.dev-port", "5173")
                .withProperty("app.frontend.backend-host", "127.0.0.1");
    }

    @Test
    void missingDependenciesGiveActionableError() {
        FrontendDevServer server = new FrontendDevServer(environment());
        assertThatThrownBy(() -> server.start(8123)).isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("npm ci");
    }

    @Test
    void startsNodeWithBackendProxyAndStopsOwnedProcess() throws Exception {
        Path script = directory.resolve("node_modules/vite/bin/vite.js");
        Files.createDirectories(script.getParent());
        Files.writeString(script, "require('fs').writeFileSync('started.txt', process.pid + '\\n' + process.env.BACKEND_PROXY_TARGET); setInterval(() => {}, 1000);");
        FrontendDevServer server = new FrontendDevServer(environment());
        long pid;
        try {
            server.start(8123);
            var lines = Files.readAllLines(directory.resolve("started.txt"));
            pid = Long.parseLong(lines.get(0));
            assertThat(lines.get(1)).isEqualTo("http://127.0.0.1:8123");
            assertThat(ProcessHandle.of(pid).map(ProcessHandle::isAlive).orElse(false)).isTrue();
        } finally {
            server.stop();
        }
        assertThat(ProcessHandle.of(pid).map(ProcessHandle::isAlive).orElse(false)).isFalse();
    }
}
