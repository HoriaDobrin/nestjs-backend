import * as fs from 'fs/promises';

const filePath = 'C:/Users/Ponta/Desktop/InternProject/nestjs-backend/src/data';

export async function readDataFromFile<T>(fileName: string): Promise<T[]> {
  try {
    const jsonData = await fs.readFile(`${filePath}/${fileName}.json`, 'utf8');
    const data = JSON.parse(jsonData);
    return data;
  } catch (error) {
    console.error(`Eroare la citirea fișierului ${fileName}:`, error);
    return [];
  }
}

export async function writeDataToFile(
  fileName: string,
  data: any[],
): Promise<void> {
  try {
    await fs.writeFile(
      `${filePath}/${fileName}.json`,
      JSON.stringify(data, null, 2),
      'utf8',
    );
  } catch (error) {
    console.error(`Eroare la scrierea fișierului ${fileName}:`, error);
  }
}
