import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientStore {
  clients: Client[];
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  upsertClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ clients: [...state.clients, newClient] }));
      },
      updateClient: (id, clientData) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...clientData, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        }));
      },
      upsertClient: (clientData) => {
        const state = get();
        if (!clientData.name || clientData.name.trim() === "") return;
        
        const existing = state.clients.find(
          (c) => c.name.trim().toLowerCase() === clientData.name.trim().toLowerCase()
        );
        
        if (existing) {
          const updates: Partial<Client> = {};
          if (clientData.phone) updates.phone = clientData.phone;
          if (clientData.address) updates.address = clientData.address;
          if (clientData.notes) updates.notes = clientData.notes;

          if (Object.keys(updates).length > 0) {
            state.updateClient(existing.id, updates);
          }
        } else {
          state.addClient(clientData);
        }
      },
    }),
    {
      name: "ajmo-clients-storage",
    }
  )
);
