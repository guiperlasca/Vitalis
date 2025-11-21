package com.vitalis.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "agendamentos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "clinica_id", nullable = false)
    private Clinica clinica;

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "agendamento_procedimentos", joinColumns = @JoinColumn(name = "agendamento_id"), inverseJoinColumns = @JoinColumn(name = "procedimento_id"))
    private List<Procedimento> procedimentos = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgendamentoStatus status;

    private String observacoes;

    @PrePersist
    @PreUpdate
    public void calcularValorTotal() {
        if (procedimentos != null && !procedimentos.isEmpty()) {
            this.valorTotal = procedimentos.stream()
                    .map(Procedimento::getPreco)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } else {
            this.valorTotal = BigDecimal.ZERO;
        }
    }
}
