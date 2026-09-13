package com.ourcommunity.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import jakarta.annotation.PreDestroy;

@Component
@Profile("local")
@ConditionalOnProperty(name = "app.frontend.auto-start", havingValue = "true")
public class FrontendDevServer {
    private static final Logger log = LoggerFactory.getLogger(FrontendDevServer.class);
    private final Environment environment;
    private Process process;
    private volatile boolean stopping;

    public FrontendDevServer(Environment environment) { this.environment = environment; }

    @EventListener(ApplicationReadyEvent.class)
    public void start(ApplicationReadyEvent event) throws IOException, InterruptedException {
        if (event.getApplicationContext() instanceof WebServerApplicationContext context) {
            start(context.getWebServer().getPort());
        }
    }

    void start(int backendPort) throws IOException, InterruptedException {
        Path directory = Path.of(environment.getRequiredProperty("app.frontend.directory")).toAbsolutePath().normalize();
        // IDE의 프로젝트 루트 실행과 Gradle의 백엔드 폴더 실행을 모두 지원합니다.
        if (!Files.isDirectory(directory) && !Path.of(environment.getRequiredProperty("app.frontend.directory")).isAbsolute()) {
            Path workingDirectory = Path.of("").toAbsolutePath();
            if (workingDirectory.getParent() != null) {
                directory = workingDirectory.getParent().resolve(environment.getRequiredProperty("app.frontend.directory")).normalize();
            }
        }
        Path vite = directory.resolve("node_modules/vite/bin/vite.js");
        if (!Files.isRegularFile(vite)) {
            throw new IllegalStateException("프론트 경로를 확인하고 front-everyrecommand에서 npm ci를 먼저 실행하세요. FRONTEND_AUTO_START=false로 자동 실행을 끌 수 있습니다.");
        }
        int frontendPort = environment.getRequiredProperty("app.frontend.dev-port", Integer.class);
        if (frontendPort < 1 || frontendPort > 65535) throw new IllegalArgumentException("Invalid frontend port");
        ProcessBuilder builder = new ProcessBuilder(
                environment.getRequiredProperty("app.frontend.node-executable"), vite.toString(),
                "--host", environment.getRequiredProperty("app.frontend.dev-host"),
                "--port", Integer.toString(frontendPort), "--strictPort");
        builder.directory(directory.toFile()).redirectErrorStream(true).redirectOutput(ProcessBuilder.Redirect.INHERIT);
        String target = environment.getProperty("app.frontend.backend-proxy-target", "");
        if (target.isBlank()) {
            String scheme = environment.getProperty("server.ssl.enabled", Boolean.class, false) ? "https" : "http";
            target = scheme + "://" + environment.getRequiredProperty("app.frontend.backend-host") + ":" + backendPort;
        }
        builder.environment().put("BACKEND_PROXY_TARGET", target);
        process = builder.start();
        if (process.waitFor(2, TimeUnit.SECONDS)) {
            throw new IllegalStateException("프론트 개발 서버가 종료되었습니다. Node 버전과 프론트 포트 사용 여부를 확인하세요.");
        }
        process.onExit().thenAccept(exited -> {
            if (!stopping) log.warn("프론트 개발 서버 종료: exitCode={}", exited.exitValue());
        });
        log.info("프론트 개발 서버 시작: port={}", frontendPort);
    }

    @PreDestroy
    public void stop() {
        stopping = true;
        if (process == null) return;
        // 직접 시작한 프로세스만 종료하며 사용자가 별도로 실행한 서버에는 접근하지 않습니다.
        process.descendants().forEach(ProcessHandle::destroy);
        process.destroy();
        try {
            if (!process.waitFor(5, TimeUnit.SECONDS)) process.destroyForcibly();
        } catch (InterruptedException exception) {
            process.destroyForcibly();
            Thread.currentThread().interrupt();
        }
    }
}
