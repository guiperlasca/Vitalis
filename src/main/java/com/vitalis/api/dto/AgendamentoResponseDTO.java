package com.vitalis.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vitalis.api.entity.AgendamentoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgendamentoResponseDTO {
    private Long id;
    private String pacienteNome;
    private String clinicaNomeFantasia;
    private List<ProcedimentoResponseDTO> procedimentos;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataHora;

    private BigDecimal valorTotal;
    private AgendamentoStatus status;
    private String observacoes;
    private ProntuarioDTO prontuario;
}
