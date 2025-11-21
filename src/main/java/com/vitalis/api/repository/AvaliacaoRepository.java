package com.vitalis.api.repository;

import com.vitalis.api.entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.agendamento.clinica.id = :clinicaId")
    Double calculateAverageRatingByClinicaId(Long clinicaId);

    List<Avaliacao> findByAgendamentoClinicaId(Long clinicaId);
}
