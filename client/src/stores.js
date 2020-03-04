import { writable } from 'svelte/store';

export const user = writable(sessionStorage.getItem('dgUser') || {});
export const users = writable(sessionStorage.getItem('dgUsers') || []);
