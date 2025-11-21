case REALIZADO:
                agendamentoService.finalizarAtendimento(id);
                break;
            case CANCELADO:
                agendamentoService.cancelarAgendamento(id);
                break;
            default:
                // For PENDING or others, do nothing or throw error
                break;
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar agendamento")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        agendamentoService.cancelarAgendamento(id);
        return ResponseEntity.noContent().build();
    }
}
