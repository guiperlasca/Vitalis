package com.vitalis.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProntuarioDTO {

    private Long id;
    private String descricaoSintomas;
    private String diagnostico;
    private String prescricaoMedica;
    private LocalDateTime dataRegistro;
}
