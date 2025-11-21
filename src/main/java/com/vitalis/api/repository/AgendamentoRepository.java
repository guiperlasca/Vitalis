package com.vitalis.api.repository;

import com.vitalis.api.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByPacienteId(Long pacienteId);

    List<Agendamento> findByClinicaId(Long clinicaId);

    @Query("SELECT SUM(a.valorTotal) FROM Agendamento a WHERE a.clinica.id = :clinicaId AND a.status = 'REALIZADO' AND a.dataHora BETWEEN :dataInicio AND :dataFim")
    BigDecimal calculateTotalFaturamento(Long clinicaId, LocalDateTime dataInicio, LocalDateTime dataFim);
}
