package com.ld.poetry;

//import com.ld.poetry.utils.mail.Mail;
import com.ld.poetry.utils.mail.MailProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import jakarta.annotation.Resource;

@SpringBootApplication
@EnableScheduling
@EnableAsync

public class PoetryApplication {

    public static void main(String[] args) {


        SpringApplication.run(PoetryApplication.class, args);

    }

}
