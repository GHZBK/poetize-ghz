package com.ld.poetry.utils.mail;

import lombok.Data;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Data
@ToString
@Configuration
@ConfigurationProperties(prefix = "spring.mail.custom")
public class MailProperties {
    private String host;
    private String username;
    private String password;
}
