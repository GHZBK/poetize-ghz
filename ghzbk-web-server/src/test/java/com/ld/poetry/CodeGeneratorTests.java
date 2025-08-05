package com.ld.poetry;

import com.ld.poetry.utils.CodeGenerator;
import com.ld.poetry.utils.mail.MailProperties;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;

import java.util.List;

@SpringBootTest
public class CodeGeneratorTests {

    @Resource
    CodeGenerator codeGenerator;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Resource
    MailProperties mailProperties;

    @Autowired
    private Environment env;

    @Test
    void contextLoads() {
        System.out.println("✅ Spring Boot 配置加载成功");
        System.out.println("@@@@");
        System.out.println(fromEmail);
        System.out.println(mailProperties.getUsername());
        System.out.println(mailProperties.getPassword());
        System.out.println(mailProperties.getHost());

        String username = env.getProperty("spring.mail.username");
        String password = env.getProperty("spring.mail.password");
        System.out.println(username);
        System.out.println(password);
    }



}
