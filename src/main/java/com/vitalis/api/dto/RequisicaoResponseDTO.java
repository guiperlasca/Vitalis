package com.vitalis.api.dto;

import com.vitalis.api.entity.RequisicaoPrioridade;
import com.vitalis.api.entity.RequisicaoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequisicaoResponseDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private RequisicaoStatus status;
    private RequisicaoPrioridade prioridade;
    private String solicitante;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}
