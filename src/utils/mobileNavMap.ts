import type { MobileNavId } from '../components/MobileBottomNav';
import type { AppView } from '../types/navigation';

export function appViewToMobileNavId(view: AppView): MobileNavId {
    switch (view) {
        case 'dashboard':
            return 'forge';
        case 'strategies':
            return 'library';
        case 'walkforward':
            return 'walk';
        case 'history':
            return 'logs';
        case 'settings':
        case 'parameters':
        case 'montecarlo':
        case 'ga':
        case 'documentation':
        default:
            return 'config';
    }
}

export function mobileNavIdToAppView(id: MobileNavId): AppView {
    switch (id) {
        case 'forge':
            return 'dashboard';
        case 'library':
            return 'strategies';
        case 'walk':
            return 'walkforward';
        case 'logs':
            return 'history';
        case 'config':
            return 'settings';
    }
}
