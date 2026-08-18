const fs = require('fs');
const exercisesJson = JSON.parse(fs.readFileSync('exercises.json', 'utf8'));

const kebabCase = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const seen = new Set();
const exercises = [];

for (const ex of exercisesJson) {
  const id = kebabCase(ex.name);
  if (!seen.has(id)) {
    seen.add(id);
    exercises.push({
      id,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      category: ex.category
    });
  }
}

let result = `import type { DatabaseConnection } from '../initializeDatabase';

export const DEFAULT_SEED_EXERCISES = [
`;
for (const ex of exercises) {
  result += `  { id: '${ex.id}', name: '${ex.name}', muscleGroup: '${ex.muscleGroup}', category: '${ex.category}', isCustom: false, createdAt: 0, updatedAt: 0 },\n`;
}
result += `] as const;

export async function seedExercises(database: DatabaseConnection): Promise<void> {
  for (const item of DEFAULT_SEED_EXERCISES) {
    await (database as any).runAsync?.(
      \`INSERT OR IGNORE INTO exercises (id, name, muscle_group, category, is_custom, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, ?);\`,
      [item.id, item.name, item.muscleGroup, item.category, item.createdAt, item.updatedAt],
    ) ?? (database as any).execAsync?.(
      \`INSERT OR IGNORE INTO exercises (id, name, muscle_group, category, is_custom, created_at, updated_at)
       VALUES ('\${item.id}', '\${item.name}', '\${item.muscleGroup}', '\${item.category}', 0, \${item.createdAt}, \${item.updatedAt});\`
    );
  }
}
`;

fs.writeFileSync('src/database/seed/exercisesSeed.ts', result);
console.log('Generated ' + exercises.length + ' exercises.');
