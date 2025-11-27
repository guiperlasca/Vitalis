package com.vitalis.api.controller;

import com.vitalis.api.service.DataSeederService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Funcionalidades Administrativas")
public class AdminController {

    private final DataSeederService dataSeederService;

    @PostMapping("/seed")
    @Operation(summary = "Popular banco de dados com dados de teste")
    public ResponseEntity<String> seedDatabase() {
        dataSeederService.seedData();
        return ResponseEntity.ok("Banco de dados populado com sucesso!");
    }
}
