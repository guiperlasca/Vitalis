package com.vitalis.api.service;

import com.vitalis.api.entity.*;
import com.vitalis.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;

@Service
@RequiredArgsConstructor
public class DataSeederService implements CommandLineRunner {

        @Override
        public void run(String... args) throws Exception {
                seedData();
        }

        private final UsuarioRepository usuarioRepository;
        private final ClinicaRepository clinicaRepository;
        private final PacienteRepository pacienteRepository;
        private final ProcedimentoRepository procedimentoRepository;
        private final AgendamentoRepository agendamentoRepository;
        private final AvaliacaoRepository avaliacaoRepository;
        private final ProntuarioRepository prontuarioRepository;
        private final PasswordEncoder passwordEncoder;

        @Transactional
        public void seedData() {
                if (usuarioRepository.count() > 0) {
                        return; // Data already exists
                }

                // --- USERS ---
                Usuario admin = createUser("Admin", "admin@vitalis.com", "admin123", UserRole.ROLE_ADMIN);
                Usuario pacienteUser1 = createUser("João Paciente", "joao@email.com", "123456", UserRole.ROLE_PACIENTE);
                Usuario pacienteUser2 = createUser("Maria Silva", "maria@email.com", "123456", UserRole.ROLE_PACIENTE);
                Usuario pacienteUser3 = createUser("Carlos Oliveira", "carlos@email.com", "123456",
                                UserRole.ROLE_PACIENTE);

                // --- PATIENTS ---
                Paciente p1 = createPaciente("João Paciente", "123.456.789-00", "joao@email.com", "11999999999",
                                LocalDate.of(1990, 5, 15), "Av. Paulista, 1000", "Hipertensão leve.");
                Paciente p2 = createPaciente("Maria Silva", "234.567.890-11", "maria@email.com", "11988888888",
                                LocalDate.of(1985, 8, 20), "Rua Augusta, 500", "Diabética tipo 2.");
                Paciente p3 = createPaciente("Carlos Oliveira", "345.678.901-22", "carlos@email.com", "11977777777",
                                LocalDate.of(1995, 2, 10), "Rua da Consolação, 300", "Sem histórico relevante.");

                List<Paciente> pacientes = List.of(p1, p2, p3);

                // --- CARDIOLOGY CLINICS (5) ---
                String[] cardioNames = { "CardioPulse", "Coração Saudável", "Ritmo Vital", "CardioCenter",
                                "VidaCardio" };
                for (int i = 0; i < 5; i++) {
                        String name = cardioNames[i];
                        String email = "cardio" + (i + 1) + "@vitalis.com";
                        createUser(name, email, "123456", UserRole.ROLE_CLINICA);

                        Clinica clinica = createClinica(name, name + " Ltda", "Cardiologia",
                                        "Av. Cardiologia, " + (100 * (i + 1)), 4.5 + (i * 0.1));

                        // Procedures
                        Procedimento p1_c = createProcedimento("Consulta Cardiológica", "Consulta completa",
                                        new BigDecimal("300.00"), 40, clinica);
                        Procedimento p2_c = createProcedimento("Eletrocardiograma", "Exame de ritmo",
                                        new BigDecimal("150.00"), 20, clinica);
                        Procedimento p3_c = createProcedimento("Ecocardiograma", "Ultrassom do coração",
                                        new BigDecimal("400.00"), 45, clinica);
                        Procedimento p4_c = createProcedimento("Teste Ergométrico", "Teste de esteira",
                                        new BigDecimal("250.00"), 30, clinica);
                        Procedimento p5_c = createProcedimento("Holter 24h", "Monitoramento 24h",
                                        new BigDecimal("200.00"), 15, clinica);

                        List<Procedimento> procs = List.of(p1_c, p2_c, p3_c, p4_c, p5_c);
                        createRandomAppointments(clinica, pacientes, procs);
                }

                // --- GENERAL PRACTICE CLINICS (5) ---
                String[] generalNames = { "Clínica da Família", "Bem Estar Geral", "Saúde Integrada", "Vitalidade",
                                "Clínica Popular" };
                for (int i = 0; i < 5; i++) {
                        String name = generalNames[i];
                        String email = "geral" + (i + 1) + "@vitalis.com";
                        createUser(name, email, "123456", UserRole.ROLE_CLINICA);

                        Clinica clinica = createClinica(name, name + " S/A", "Clínica Geral",
                                        "Rua da Saúde, " + (50 * (i + 1)), 4.0 + (i * 0.2));

                        // Procedures
                        Procedimento p1_g = createProcedimento("Consulta Geral", "Avaliação clínica",
                                        new BigDecimal("150.00"), 30, clinica);
                        Procedimento p2_g = createProcedimento("Check-up Básico", "Exames de rotina",
                                        new BigDecimal("200.00"), 45, clinica);
                        Procedimento p3_g = createProcedimento("Aferição Pressão", "Medição de PA",
                                        new BigDecimal("20.00"), 10, clinica);
                        Procedimento p4_g = createProcedimento("Teste Glicemia", "Teste de açúcar",
                                        new BigDecimal("15.00"), 5, clinica);
                        Procedimento p5_g = createProcedimento("Vacinação (Gripe)", "Aplicação de vacina",
                                        new BigDecimal("80.00"), 15, clinica);

                        List<Procedimento> procs = List.of(p1_g, p2_g, p3_g, p4_g, p5_g);
                        createRandomAppointments(clinica, pacientes, procs);
                }

                // --- DERMATOLOGY CLINICS (5) ---
                String[] dermoNames = { "DermoEstética", "Pele Perfeita", "DermaCare", "Estética Avançada",
                                "SkinHealth" };
                for (int i = 0; i < 5; i++) {
                        String name = dermoNames[i];
                        String email = "dermo" + (i + 1) + "@vitalis.com";
                        createUser(name, email, "123456", UserRole.ROLE_CLINICA);

                        Clinica clinica = createClinica(name, name + " Ltda", "Dermatologia",
                                        "Av. da Beleza, " + (200 * (i + 1)), 4.7 + (i * 0.05));

                        // Procedures
                        Procedimento p1_d = createProcedimento("Consulta Dermatológica", "Avaliação de pele",
                                        new BigDecimal("250.00"), 30, clinica);
                        Procedimento p2_d = createProcedimento("Limpeza de Pele", "Procedimento estético",
                                        new BigDecimal("180.00"), 60, clinica);
                        Procedimento p3_d = createProcedimento("Botox (Região)", "Aplicação de toxina",
                                        new BigDecimal("800.00"), 30, clinica);
                        Procedimento p4_d = createProcedimento("Peeling Químico", "Renovação celular",
                                        new BigDecimal("350.00"), 45, clinica);
                        Procedimento p5_d = createProcedimento("Remoção de Verrugas", "Pequena cirurgia",
                                        new BigDecimal("150.00"), 20, clinica);

                        List<Procedimento> procs = List.of(p1_d, p2_d, p3_d, p4_d, p5_d);
                        createRandomAppointments(clinica, pacientes, procs);
                }

                // --- PEDIATRICS CLINICS (5) ---
                String[] pediaNames = { "Kids Care", "Pediatria Feliz", "Mundo da Criança", "BabyHealth",
                                "Crescer Saudável" };
                for (int i = 0; i < 5; i++) {
                        String name = pediaNames[i];
                        String email = "pedia" + (i + 1) + "@vitalis.com";
                        createUser(name, email, "123456", UserRole.ROLE_CLINICA);

                        Clinica clinica = createClinica(name, name + " S/A", "Pediatria",
                                        "Rua dos Pequenos, " + (80 * (i + 1)), 4.8 + (i * 0.02));

                        // Procedures
                        Procedimento p1_p = createProcedimento("Consulta Pediátrica", "Avaliação geral",
                                        new BigDecimal("200.00"), 40, clinica);
                        Procedimento p2_p = createProcedimento("Vacinação Infantil", "Calendário vacinal",
                                        new BigDecimal("100.00"), 20, clinica);
                        Procedimento p3_p = createProcedimento("Puericultura", "Acompanhamento crescimento",
                                        new BigDecimal("180.00"), 30, clinica);
                        Procedimento p4_p = createProcedimento("Teste do Pezinho", "Triagem neonatal",
                                        new BigDecimal("50.00"), 10, clinica);
                        Procedimento p5_p = createProcedimento("Inalação", "Tratamento respiratório",
                                        new BigDecimal("40.00"), 20, clinica);

                        List<Procedimento> procs = List.of(p1_p, p2_p, p3_p, p4_p, p5_p);
                        createRandomAppointments(clinica, pacientes, procs);
                }

                // --- ORTHOPEDICS CLINICS (5) ---
                String[] ortoNames = { "OrtoVida", "Coluna Vertebral", "Movimento Livre", "OrtoCenter", "TraumaCare" };
                for (int i = 0; i < 5; i++) {
                        String name = ortoNames[i];
                        String email = "orto" + (i + 1) + "@vitalis.com";
                        createUser(name, email, "123456", UserRole.ROLE_CLINICA);

                        Clinica clinica = createClinica(name, name + " Ltda", "Ortopedia",
                                        "Av. dos Esportes, " + (300 * (i + 1)), 4.6 + (i * 0.05));

                        // Procedures
                        Procedimento p1_o = createProcedimento("Consulta Ortopédica", "Avaliação óssea",
                                        new BigDecimal("280.00"), 30, clinica);
                        Procedimento p2_o = createProcedimento("Raio-X (Simples)", "Exame de imagem",
                                        new BigDecimal("120.00"), 15, clinica);
                        Procedimento p3_o = createProcedimento("Fisioterapia (Sessão)", "Reabilitação",
                                        new BigDecimal("100.00"), 50, clinica);
                        Procedimento p4_o = createProcedimento("Imobilização (Gesso)", "Tratamento fratura",
                                        new BigDecimal("200.00"), 40, clinica);
                        Procedimento p5_o = createProcedimento("Infiltração", "Alívio de dor",
                                        new BigDecimal("400.00"), 30, clinica);

                        List<Procedimento> procs = List.of(p1_o, p2_o, p3_o, p4_o, p5_o);
                        createRandomAppointments(clinica, pacientes, procs);
                }
        }

        private void createRandomAppointments(Clinica clinica, List<Paciente> pacientes, List<Procedimento> procs) {
                // 1. Completed with Record & Review
                Agendamento a1 = createAgendamento(pacientes.get(0), clinica, List.of(procs.get(0)),
                                LocalDateTime.now().minusDays(10).withHour(10), AgendamentoStatus.REALIZADO, "Rotina");
                createProntuario(a1, "Paciente relata cansaço.", "Estresse leve.", "Repouso e hidratação.");
                createAvaliacao(a1, 5, "Ótimo atendimento!");

                // 2. Completed with Record only
                Agendamento a2 = createAgendamento(pacientes.get(1), clinica, List.of(procs.get(1)),
                                LocalDateTime.now().minusDays(5).withHour(14), AgendamentoStatus.REALIZADO, "Exames");
                createProntuario(a2, "Sem queixas.", "Exames normais.", "Retorno em 6 meses.");

                // 3. Confirmed (Future)
                createAgendamento(pacientes.get(2), clinica, List.of(procs.get(0)),
                                LocalDateTime.now().plusDays(2).withHour(9), AgendamentoStatus.CONFIRMADO,
                                "Primeira consulta");

                // 4. Pending (Future)
                createAgendamento(pacientes.get(0), clinica, List.of(procs.get(2)),
                                LocalDateTime.now().plusDays(5).withHour(16), AgendamentoStatus.PENDENTE,
                                "Aguardando confirmação");

                // 5. Cancelled (Past)
                createAgendamento(pacientes.get(1), clinica, List.of(procs.get(0)),
                                LocalDateTime.now().minusDays(2).withHour(11), AgendamentoStatus.CANCELADO,
                                "Imprevisto");
        }

        private Usuario createUser(String nome, String email, String senha, UserRole role) {
                Usuario usuario = Usuario.builder()
                                .nome(nome)
                                .email(email)
                                .senha(passwordEncoder.encode(senha))
                                .role(role)
                                .ativo(true)
                                .build();
                return usuarioRepository.save(usuario);
        }

        private Paciente createPaciente(String nome, String cpf, String email, String telefone, LocalDate nascimento,
                        String endereco, String historico) {
                Paciente paciente = Paciente.builder()
                                .nome(nome)
                                .cpf(cpf)
                                .email(email)
                                .telefone(telefone)
                                .dataNascimento(nascimento)
                                .endereco(endereco)
                                .historicoMedico(historico)
                                .ativo(true)
                                .build();
                return pacienteRepository.save(paciente);
        }

        private Clinica createClinica(String nome, String razao, String especialidade, String endereco,
                        Double avaliacao) {
                Clinica clinica = Clinica.builder()
                                .nomeFantasia(nome)
                                .razaoSocial(razao)
                                .especialidade(especialidade)
                                .endereco(endereco)
                                .avaliacao(avaliacao)
                                .ativo(true)
                                .build();
                return clinicaRepository.save(clinica);
        }

        private Procedimento createProcedimento(String nome, String descricao, BigDecimal preco, Integer duracao,
                        Clinica clinica) {
                Procedimento proc = Procedimento.builder()
                                .nome(nome)
                                .descricao(descricao)
                                .preco(preco)
                                .duracaoEstimadaMinutos(duracao)
                                .clinica(clinica)
                                .disponivel(true)
                                .build();
                return procedimentoRepository.save(proc);
        }

        private Agendamento createAgendamento(Paciente paciente, Clinica clinica, List<Procedimento> procedimentos,
                        LocalDateTime dataHora, AgendamentoStatus status, String obs) {
                Agendamento ag = Agendamento.builder()
                                .paciente(paciente)
                                .clinica(clinica)
                                .procedimentos(procedimentos)
                                .dataHora(dataHora)
                                .status(status)
                                .observacoes(obs)
                                .build();
                ag.calcularValorTotal();
                return agendamentoRepository.save(ag);
        }

        private void createProntuario(Agendamento agendamento, String sintomas, String diagnostico, String prescricao) {
                Prontuario prontuario = Prontuario.builder()
                                .agendamento(agendamento)
                                .descricaoSintomas(sintomas)
                                .diagnostico(diagnostico)
                                .prescricaoMedica(prescricao)
                                .build();
                prontuarioRepository.save(prontuario);
        }

        private void createAvaliacao(Agendamento agendamento, Integer nota, String comentario) {
                Avaliacao avaliacao = Avaliacao.builder()
                                .agendamento(agendamento)
                                .nota(nota)
                                .comentario(comentario)
                                .build();
                avaliacaoRepository.save(avaliacao);
        }
}
