package com.vitalis.api.repository;

import com.vitalis.api.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByPacienteId(Long pacienteId);

    List<Agendamento> findByClinicaId(Long clinicaId);
}
