// server/src/seeders/migrate-existing-structure.js
const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');

const prisma = new PrismaClient();

async function migrateExistingStructure() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'Health_DataBase',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    console.log('🔄 Analyse de la structure existante...');
    
    // Voir toutes les tables existantes
    const existingTables = await client.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    
    console.log('📋 Structure existante:');
    const tableStructure = {};
    existingTables.rows.forEach(row => {
      if (!tableStructure[row.table_name]) {
        tableStructure[row.table_name] = [];
      }
      tableStructure[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable
      });
    });
    
    Object.keys(tableStructure).forEach(tableName => {
      console.log(`\n📊 Table: ${tableName}`);
      tableStructure[tableName].forEach(col => {
        console.log(`  - ${col.column}: ${col.type} ${col.nullable === 'NO' ? '(NOT NULL)' : ''}`);
      });
    });
    
    // Compter les enregistrements existants
    for (const tableName of Object.keys(tableStructure)) {
      try {
        const count = await client.query(`SELECT COUNT(*) FROM "${tableName}"`);
        console.log(`📊 ${tableName}: ${count.rows[0].count} enregistrements`);
      } catch (error) {
        console.log(`❌ Impossible de compter ${tableName}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
    await prisma.$disconnect();
  }
}

migrateExistingStructure();