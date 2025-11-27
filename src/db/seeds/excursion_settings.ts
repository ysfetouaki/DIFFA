import { db } from '@/db';
import { excursionSettings } from '@/db/schema';

async function main() {
    try {
        const sampleSettings = [
            {
                section: 'marrakech',
                showPrice: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                section: 'agadir',
                showPrice: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                section: 'taghazout',
                showPrice: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                section: 'circuits',
                showPrice: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        ];

        await db.insert(excursionSettings).values(sampleSettings);
        
        console.log('✅ Excursion settings seeder completed successfully');
    } catch (error) {
        console.error('❌ Seeder failed:', error);
        throw error;
    }
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});