export interface ProficiencyLevel {
    code: string;
    name: {
        es: string;
        en: string;
    };
    description: {
        es: string;
        en: string;
    };
}

export const proficiencyLevels: ProficiencyLevel[] = [
    { 
        code: 'A1', 
        name: { es: 'A1 - Principiante', en: 'A1 - Beginner' },
        description: { es: 'Nivel básico', en: 'Basic level' }
    },
    { 
        code: 'A2', 
        name: { es: 'A2 - Elemental', en: 'A2 - Elementary' },
        description: { es: 'Nivel elemental', en: 'Elementary level' }
    },
    { 
        code: 'B1', 
        name: { es: 'B1 - Intermedio', en: 'B1 - Intermediate' },
        description: { es: 'Nivel intermedio', en: 'Intermediate level' }
    },
    { 
        code: 'B2', 
        name: { es: 'B2 - Intermedio Alto', en: 'B2 - Upper Intermediate' },
        description: { es: 'Nivel intermedio alto', en: 'Upper intermediate level' }
    },
    { 
        code: 'C1', 
        name: { es: 'C1 - Avanzado', en: 'C1 - Advanced' },
        description: { es: 'Nivel avanzado', en: 'Advanced level' }
    },
    { 
        code: 'C2', 
        name: { es: 'C2 - Dominio', en: 'C2 - Proficiency' },
        description: { es: 'Dominio completo', en: 'Full proficiency' }
    },
    { 
        code: 'NATIVE', 
        name: { es: 'Nativo', en: 'Native' },
        description: { es: 'Hablante nativo', en: 'Native speaker' }
    },
];
