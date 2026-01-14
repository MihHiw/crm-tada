import { OperatingDay } from '@/types/types';

export const mockOperatingDays: OperatingDay[] = [
    { id: 1, day_of_week: 1, open_time: '09:00', close_time: '21:00', is_closed: false },
    { id: 2, day_of_week: 2, open_time: '09:00', close_time: '21:00', is_closed: false },
    { id: 3, day_of_week: 3, open_time: '09:00', close_time: '21:00', is_closed: false },
    { id: 4, day_of_week: 4, open_time: '09:00', close_time: '21:00', is_closed: false },
    { id: 5, day_of_week: 5, open_time: '09:00', close_time: '21:00', is_closed: false },
    { id: 6, day_of_week: 6, open_time: '08:00', close_time: '22:00', is_closed: false },
    { id: 0, day_of_week: 0, open_time: '08:00', close_time: '22:00', is_closed: true },
];
