package com.ld.poetry.utils;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Scanner;

@Component
public class CodeGenerator {

   @Resource
   DataSourceProperties dataSourceProperties;

    public void run() {
        System.out.println("==🚀 配置加载==");
        System.out.println("url = " + dataSourceProperties.getUrl());
        System.out.println("username = " + dataSourceProperties.getUsername());
        System.out.println("password = " + dataSourceProperties.getPassword());

        FastAutoGenerator.create(dataSourceProperties.getUrl(), dataSourceProperties.getUsername(), dataSourceProperties.getPassword())
                .globalConfig(builder -> builder
                        .author("sara")
                        .enableSwagger()
                        .disableOpenDir()
                        .outputDir(System.getProperty("user.dir") + "/src/main/java"))
                .packageConfig(builder -> builder
                        .parent("com.ld.poetry")
                        .entity("entity")
                        .service("service")
                        .serviceImpl("service.impl")
                        .mapper("mapper")
                        .xml("mapper.xml")
                        .pathInfo(Collections.singletonMap(OutputFile.xml,
                                System.getProperty("user.dir") + "/src/main/resources/mapper")))
                .strategyConfig(builder -> builder
                        .addInclude(scanner("表名，多个英文逗号分割").split(","))
                        .addTablePrefix("t_", "c_")
                        .entityBuilder().enableLombok().enableTableFieldAnnotation()
                        .mapperBuilder().enableMapperAnnotation().enableBaseResultMap().enableBaseColumnList()
                        .serviceBuilder().formatServiceFileName("%sService").formatServiceImplFileName("%sServiceImpl")
                        .controllerBuilder().enableRestStyle().formatFileName("%sController"))
                .templateEngine(new FreemarkerTemplateEngine())
                .execute();
    }



    private static String scanner(String tip) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("请输入 " + tip + "：");
        if (scanner.hasNext()) {
            String input = scanner.next();
            if (input != null && !input.trim().isEmpty()) {
                return input;
            }
        }
        throw new RuntimeException("请输入正确的 " + tip + "！");
    }
}
