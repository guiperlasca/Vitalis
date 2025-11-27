package com.vitalis.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgendamentoRequestDTO {

    @NotNull(message = "O ID da clínica é obrigatório")
    private Long clinicaId;

    @NotEmpty(message = "Selecione pelo menos um procedimento")
    private List<Long> procedimentoIds;

    @NotNull(message = "A data e hora são obrigatórias")
    @Future(message = "A data do agendamento deve ser no futuro")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime dataHora;

    private String observacoes;
}
