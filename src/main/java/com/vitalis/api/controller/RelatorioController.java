package com.vitalis.api.controller;

import com.vitalis.api.repository.AgendamentoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
@RequiredArgsConstructor
@Tag(name = "Relatórios", description = "Relatórios Gerenciais")
public class RelatorioController {

    private final AgendamentoRepository agendamentoRepository;

    @GetMapping("/faturamento")
    @Operation(summary = "Calcular faturamento total de uma clínica por período")
    public ResponseEntity<Map<String, Object>> getFaturamento(
            @RequestParam Long clinicaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        BigDecimal total = agendamentoRepository.calculateTotalFaturamento(clinicaId, dataInicio, dataFim);
        if (total == null) {
            total = BigDecimal.ZERO;
        }

        return ResponseEntity.ok(Map.of(
                "clinicaId", clinicaId,
                "dataInicio", dataInicio,
                "dataFim", dataFim,
                "faturamentoTotal", total));
    }
}
