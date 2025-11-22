package com.vitalis.api.dto;

import com.vitalis.api.entity.RequisicaoPrioridade;
import com.vitalis.api.entity.RequisicaoStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequisicaoRequestDTO {

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 200, message = "Título deve ter no máximo 200 caracteres")
    private String titulo;

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    @NotNull(message = "Status é obrigatório")
    private RequisicaoStatus status;

    @NotNull(message = "Prioridade é obrigatória")
    private RequisicaoPrioridade prioridade;

    @NotBlank(message = "Solicitante é obrigatório")
    @Size(max = 100, message = "Nome do solicitante deve ter no máximo 100 caracteres")
    private String solicitante;
}
