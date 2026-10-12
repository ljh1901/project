package com.ourcommunity.batch;

import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.Step;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.infrastructure.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.PlatformTransactionManager;

import com.ourcommunity.service.batch.BatchJobService;

/**
 * Spring Batch 작업 구성과 실행 시간의 관계.
 *
 * 1. 배치와 스케줄러의 역할
 * 배치: DB 등에 쌓인 처리 대상 데이터를 조회하여 일괄 처리하는 작업.
 * 스케줄러: 그 작업을 언제 시작할지 결정하는 기능.
 * Spring Batch는 Job과 Step을 구성하고 실행 상태를 관리
 *
 * 2. 이 클래스에서 Builder를 사용하는 방법
 * JobBuilder: 전체 작업(Job)의 이름과 실행할 Step을 설정한다.
 * StepBuilder: 작업 단계(Step)의 이름, Tasklet, 트랜잭션 관리자를 설정한다.
 * build(): 설정한 내용을 바탕으로 객체를 구성하고 초기화
 * 
 *
 * 3. 같은 Spring Batch 작업을 Builder 없이 만드는 경우
 * SimpleJob, TaskletStep 같은 구현 객체를 직접 생성한 뒤,
 * setJobRepository(), setTasklet(), addStep() 등으로 설정
 * 
 * 같은 설정이라면 실제 처리할 업무와 실행 결과는 Builder 사용 시와 동일
 * Builder 사용 여부는 Job과 Step을 만드는 방법의 차이다.
 *
 * 4. @Scheduled는 어디에 붙이는가?
 * Builder 사용 여부와 관계없이 별도 SampleBatchScheduler 클래스의
 * 실행 메서드에 붙이고, 그 메서드에서 배치 실행 API로 Job을 시작한다.
 * 이 클래스의 @Bean 메서드는 객체를 만드는 설정이므로 붙이지 않는다.
 * 
 * 스케줄링 활성화를 위해 설정 클래스에 @EnableScheduling이 필요하다.
 * 예: @Scheduled(cron = "0 0 3 * * *", zone = "Asia/Seoul")
 *
 * 
 * 5. 현재 구성의 실행 흐름
 * 스케줄러 → 배치 실행 API → sampleJob → sampleStep → sampleTasklet → Service.
 * 
 * Job: 전체 작업. 하나 이상의 Step을 순서대로 실행한다.
 * Step: 전체 작업 안의 한 단계. 여기서는 Tasklet을 실행한다.
 * Tasklet: 실제 처리 코드. 기존 Service를 호출할 위치이다.
 * RepeatStatus.FINISHED: Tasklet 처리가 끝났음을 알린다.
 * JobRepository: Job과 Step의 실행 상태를 관리한다.
 * 
 * 실행 이력이 DB에 저장되는지는 JobRepository 설정에 따라 달라진다.
 * PlatformTransactionManager: 이 Step의 트랜잭션을 관리한다.
 * contribution: 현재 Step의 처리 건수와 종료 상태 등을 반영하는 객체.
 * chunkContext: 현재 Step의 실행 정보와 Job 파라미터 등에 접근하는 객체.
 * 
 *
 * 6. Spring Batch 자체를 사용하지 않는 경우와 구분
 * @Scheduled 메서드에서 Service를 바로 호출하는 것도 일괄 처리 방식이다.
 * Spring Batch의 Job과 Step 구조 자체를 사용하지 않는 별도 방식
 */
@Configuration
@EnableScheduling 
public class SampleBatchConfig {
    
    private final BatchJobService batchJobService;
    public SampleBatchConfig(BatchJobService batchJobService){
        this.batchJobService = batchJobService;
    }
    
    // 전체 배치 작업
    @Bean
    public Job sampleJob(JobRepository jobRepository, Step sampleStep) {
        return new JobBuilder("sampleJob", jobRepository)
                .start(sampleStep)
                .build();
    }

    // 작업 단계
    @Bean
    public Step sampleStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            Tasklet sampleTasklet) {

        return new StepBuilder("sampleStep", jobRepository)
                .tasklet(sampleTasklet, transactionManager)
                .build();
    }

    // 실제 실행할 작업
    @Bean
    public Tasklet sampleTasklet() {
        return (contribution, chunkContext) -> {
            // TODO: 기존 Service를 주입받아 배치 업무 호출

            return RepeatStatus.FINISHED;
        };
    }
}
