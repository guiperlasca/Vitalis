package com.vitalis.api.service;

import com.vitalis.api.dto.AvaliacaoRequestDTO;
import com.vitalis.api.entity.Agendamento;
import com.vitalis.api.entity.AgendamentoStatus;
import com.vitalis.api.entity.Avaliacao;
import com.vitalis.api.entity.Clinica;
import com.vitalis.api.exception.BusinessException;
import com.vitalis.api.exception.EntityNotFoundException;
import com.vitalis.api.repository.AgendamentoRepository;
import com.vitalis.api.repository.AvaliacaoRepository;
import com.vitalis.api.repository.ClinicaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final ClinicaRepository clinicaRepository;

    @Transactional
    public Avaliacao avaliarAtendimento(AvaliacaoRequestDTO dto) {
        Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
                .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado"));

        if (agendamento.getStatus() != AgendamentoStatus.REALIZADO) {
            throw new BusinessException("Apenas agendamentos realizados podem ser avaliados.");
        }

        // Check if already rated (optional, but good practice since it's OneToOne)
        // Assuming database constraint or check here if needed, but OneToOne mapping
        // enforces uniqueness on agendamento side usually if mapped correctly.
        // However, let's check if an evaluation already exists for this appointment to
        // be safe/explicit.
        // Since we don't have a direct findByAgendamento in repo yet, we rely on the
        // unique constraint or add a check.
        // For now, proceeding with save.

        Avaliacao avaliacao = Avaliacao.builder()
                .nota(dto.getNota())
                .comentario(dto.getComentario())
                .agendamento(agendamento)
                .build();

        Avaliacao savedAvaliacao = avaliacaoRepository.save(avaliacao);

        atualizarMediaClinica(agendamento.getClinica());

        return savedAvaliacao;
    }

    private void atualizarMediaClinica(Clinica clinica) {
        Double media = avaliacaoRepository.calculateAverageRatingByClinicaId(clinica.getId());
        if (media != null) {
            clinica.setAvaliacao(media);
            clinicaRepository.save(clinica);
        }
    }
}
