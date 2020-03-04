import { writable } from 'svelte/store';

export const user = writable(JSON.parse(sessionStorage.getItem('dgUser')) || {});
export const users = writable(JSON.parse(sessionStorage.getItem('dgUsers')) || []);
