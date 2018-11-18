export enum ElectionState {
    NOT_ACTIVE = 1,
    ACTIVE = 2,
    CLOSED = 3
}

export function getElectionStateText(state: ElectionState) {
    switch (state) {
        case ElectionState.NOT_ACTIVE:
            return 'Nicht Aktiv';
        case ElectionState.ACTIVE:
            return 'Aktiv';
        case ElectionState.CLOSED:
            return 'Abgeschlossen';
    }
}