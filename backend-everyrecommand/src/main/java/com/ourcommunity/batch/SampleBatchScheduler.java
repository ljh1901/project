package com.ourcommunity.batch;

import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
/**
 * SampleBatchScheduler
 * Batch 진입점 class
 * 
 * 
 */
@Component
public class SampleBatchScheduler {
    private final JobOperator jobOperator;
    private final Job sampleJob;

    public SampleBatchScheduler(JobOperator jobOperator, @Qualifier("sampleJob") Job sampleJob) {
        this.jobOperator = jobOperator;
        this.sampleJob = sampleJob;
    }

    @Scheduled(cron = "0 0 0/1 * * *", zone = "Asia/Seoul")
    public void run() throws Exception {
        // 완료된 Job과 구분하여 매번 새로운 Job 인스턴스로 실행
        JobParameters parameters = new JobParametersBuilder()
                .addLong("runTime", System.currentTimeMillis())
                .toJobParameters();

        jobOperator.start(sampleJob, parameters);
    }
}
