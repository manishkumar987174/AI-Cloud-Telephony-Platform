import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Create a default instance for CLI direct seeding
const defaultPrisma = new PrismaClient();

async function runSeed(prismaInstance = defaultPrisma) {
  console.log('Starting database seeding with humanized mock data...');

  // Clear existing records to ensure clean slate
  console.log('Clearing existing database tables...');
  await prismaInstance.transaction.deleteMany({});
  await prismaInstance.wallet.deleteMany({});
  await prismaInstance.recording.deleteMany({});
  await prismaInstance.callLog.deleteMany({});
  await prismaInstance.contact.deleteMany({});
  await prismaInstance.campaign.deleteMany({});
  await prismaInstance.agentStatus.deleteMany({});
  await prismaInstance.user.deleteMany({});
  await prismaInstance.company.deleteMany({});

  console.log('Creating companies...');
  // 1. Create Companies
  const companyApex = await prismaInstance.company.create({
    data: {
      name: 'Apex Solutions LLC',
      plan: 'pro',
      walletBalance: 450.50,
      ratePerMinute: 1.50,
      maxAgents: 15,
      maxConcurrent: 8
    }
  });

  const companyCloudCorp = await prismaInstance.company.create({
    data: {
      name: 'CloudCorp Technologies',
      plan: 'starter',
      walletBalance: 120.00,
      ratePerMinute: 1.20,
      maxAgents: 5,
      maxConcurrent: 3
    }
  });

  console.log('Initializing company wallets...');
  // 2. Create Wallets
  await prismaInstance.wallet.create({
    data: {
      companyId: companyApex.id,
      balance: 450.50,
      currency: 'INR'
    }
  });

  await prismaInstance.wallet.create({
    data: {
      companyId: companyCloudCorp.id,
      balance: 120.00,
      currency: 'INR'
    }
  });

  console.log('👤 Seeding user accounts (admins & agents)...');
  // 3. Create Users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Apex Solutions Users
  const apexAdmin = await prismaInstance.user.create({
    data: {
      companyId: companyApex.id,
      name: 'Sarah Connor',
      email: 'sarah@apex.com',
      password: hashedPassword,
      role: 'admin',
      extension: '1001',
      sipPassword: 'sipSecretApex1001'
    }
  });

  const apexAgent = await prismaInstance.user.create({
    data: {
      companyId: companyApex.id,
      name: 'John Connor',
      email: 'john@apex.com',
      password: hashedPassword,
      role: 'agent',
      extension: '1002',
      sipPassword: 'sipSecretApex1002'
    }
  });

  // CloudCorp Users
  const cloudCorpAdmin = await prismaInstance.user.create({
    data: {
      companyId: companyCloudCorp.id,
      name: 'Ellen Ripley',
      email: 'ellen@cloudcorp.com',
      password: hashedPassword,
      role: 'admin',
      extension: '2001',
      sipPassword: 'sipSecretCloud2001'
    }
  });

  const cloudCorpAgent = await prismaInstance.user.create({
    data: {
      companyId: companyCloudCorp.id,
      name: 'Peter Parker',
      email: 'peter@cloudcorp.com',
      password: hashedPassword,
      role: 'agent',
      extension: '2002',
      sipPassword: 'sipSecretCloud2002'
    }
  });

  console.log('Creating agent statuses...');
  // Agent Statuses
  await prismaInstance.agentStatus.create({
    data: {
      agentId: apexAdmin.id,
      status: 'offline'
    }
  });

  await prismaInstance.agentStatus.create({
    data: {
      agentId: apexAgent.id,
      status: 'ready'
    }
  });

  await prismaInstance.agentStatus.create({
    data: {
      agentId: cloudCorpAdmin.id,
      status: 'offline'
    }
  });

  await prismaInstance.agentStatus.create({
    data: {
      agentId: cloudCorpAgent.id,
      status: 'ready'
    }
  });

  console.log('📢 Setting up campaigns...');
  // 4. Create Campaigns
  const campaignApexSales = await prismaInstance.campaign.create({
    data: {
      companyId: companyApex.id,
      name: 'Q2 Premium Sales Outreach',
      status: 'running'
    }
  });

  const campaignApexSurvey = await prismaInstance.campaign.create({
    data: {
      companyId: companyApex.id,
      name: 'Annual Customer Satisfaction Survey',
      status: 'paused'
    }
  });

  const campaignCloudCorpLeads = await prismaInstance.campaign.create({
    data: {
      companyId: companyCloudCorp.id,
      name: 'Tech Sector Cold Outreach',
      status: 'stopped'
    }
  });

  console.log('📞 Creating campaign contacts...');
  // 5. Create Contacts
  // Apex Contacts
  const contactApex1 = await prismaInstance.contact.create({
    data: {
      companyId: companyApex.id,
      campaignId: campaignApexSales.id,
      name: 'Bruce Wayne',
      phone: '+1555019800',
      city: 'Gotham',
      state: 'New Jersey',
      status: 'called'
    }
  });

  const contactApex2 = await prismaInstance.contact.create({
    data: {
      companyId: companyApex.id,
      campaignId: campaignApexSales.id,
      name: 'Clark Kent',
      phone: '+1555014311',
      city: 'Metropolis',
      state: 'Delaware',
      status: 'pending'
    }
  });

  const contactApex3 = await prismaInstance.contact.create({
    data: {
      companyId: companyApex.id,
      campaignId: campaignApexSurvey.id,
      name: 'Diana Prince',
      phone: '+1555018742',
      city: 'Themyscira',
      state: 'Massachusetts',
      status: 'called'
    }
  });

  // CloudCorp Contacts
  const contactCloud1 = await prismaInstance.contact.create({
    data: {
      companyId: companyCloudCorp.id,
      campaignId: campaignCloudCorpLeads.id,
      name: 'Tony Stark',
      phone: '+1555016599',
      city: 'Malibu',
      state: 'California',
      status: 'called'
    }
  });

  const contactCloud2 = await prismaInstance.contact.create({
    data: {
      companyId: companyCloudCorp.id,
      campaignId: campaignCloudCorpLeads.id,
      name: 'Steve Rogers',
      phone: '+1555017400',
      city: 'Brooklyn',
      state: 'New York',
      status: 'pending'
    }
  });

  console.log('📝 Seeding call logs & recordings...');
  // 6. Create Call Logs & Recordings
  // Apex Call Log 1 (Sarah to Bruce Wayne)
  const callApex1 = await prismaInstance.callLog.create({
    data: {
      companyId: companyApex.id,
      campaignId: campaignApexSales.id,
      agentId: apexAdmin.id,
      phoneNumber: contactApex1.phone,
      status: 'answered',
      duration: 72,
      direction: 'outbound',
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      endedAt: new Date(Date.now() - 3600000 + 72000),
      recordingUrl: '/recordings/company_1/rec_bruce_wayne_q2.wav'
    }
  });

  // Recording for Apex Call Log 1
  await prismaInstance.recording.create({
    data: {
      companyId: companyApex.id,
      callLogId: callApex1.id,
      recordingUrl: callApex1.recordingUrl,
      duration: callApex1.duration,
      transcript: 'Sarah Connor: Hello, is this Bruce Wayne? Bruce Wayne: Speaking. Sarah Connor: I am calling from Apex Solutions regarding your request for premium consulting. We have customized packages ready. Bruce Wayne: Send it to my assistant, Alfred. Thank you.'
    }
  });

  // Apex Call Log 2 (John Connor to Diana Prince)
  const callApex2 = await prismaInstance.callLog.create({
    data: {
      companyId: companyApex.id,
      campaignId: campaignApexSurvey.id,
      agentId: apexAgent.id,
      phoneNumber: contactApex3.phone,
      status: 'answered',
      duration: 145,
      direction: 'outbound',
      startedAt: new Date(Date.now() - 7200000), // 2 hours ago
      endedAt: new Date(Date.now() - 7200000 + 145000),
      recordingUrl: '/recordings/company_1/rec_diana_prince_survey.wav'
    }
  });

  await prismaInstance.recording.create({
    data: {
      companyId: companyApex.id,
      callLogId: callApex2.id,
      recordingUrl: callApex2.recordingUrl,
      duration: callApex2.duration,
      transcript: 'John Connor: Hi Diana, thank you for answering. Could you rate your satisfaction with our product? Diana Prince: Excellent. The system performs flawlessly under high load. I am thoroughly pleased.'
    }
  });

  // CloudCorp Call Log (Peter Parker to Tony Stark)
  const callCloud1 = await prismaInstance.callLog.create({
    data: {
      companyId: companyCloudCorp.id,
      campaignId: campaignCloudCorpLeads.id,
      agentId: cloudCorpAgent.id,
      phoneNumber: contactCloud1.phone,
      status: 'answered',
      duration: 48,
      direction: 'outbound',
      startedAt: new Date(Date.now() - 1800000), // 30 mins ago
      endedAt: new Date(Date.now() - 1800000 + 48000),
      recordingUrl: '/recordings/company_2/rec_tony_stark_leads.wav'
    }
  });

  await prismaInstance.recording.create({
    data: {
      companyId: companyCloudCorp.id,
      callLogId: callCloud1.id,
      recordingUrl: callCloud1.recordingUrl,
      duration: callCloud1.duration,
      transcript: 'Peter Parker: Mr. Stark! I am calling from CloudCorp with the new network designs. Tony Stark: Hey kid, good job. Drop them off in the lab later.'
    }
  });

  console.log('📈 Recording mock billing transactions...');
  // 7. Create Ledger Transactions
  // Apex Transactions
  await prismaInstance.transaction.create({
    data: {
      companyId: companyApex.id,
      type: 'credit',
      amount: 500.00,
      description: 'Account signup promo credit and manual topup'
    }
  });

  await prismaInstance.transaction.create({
    data: {
      companyId: companyApex.id,
      type: 'debit',
      amount: 49.50,
      description: 'Usage charges: 33 minutes billing at 1.50/min'
    }
  });

  // CloudCorp Transactions
  await prismaInstance.transaction.create({
    data: {
      companyId: companyCloudCorp.id,
      type: 'credit',
      amount: 150.00,
      description: 'Welcome promotional credit'
    }
  });

  await prismaInstance.transaction.create({
    data: {
      companyId: companyCloudCorp.id,
      type: 'debit',
      amount: 30.00,
      description: 'Usage charges: 25 minutes billing at 1.20/min'
    }
  });

  console.log('Database seeded successfully with humanized mock records!');
  return { success: true, message: 'Database successfully seeded with Apex Solutions and CloudCorp data.' };
}

import { fileURLToPath } from 'url';

const isMain = process.argv[1] && (process.argv[1] === fileURLToPath(import.meta.url) || process.argv[1].endsWith('seed.js'));
if (isMain) {
  runSeed()
    .catch((e) => {
      console.error('Error seeding database:', e);
      process.exit(1);
    })
    .finally(async () => {
      await defaultPrisma.$disconnect();
    });
}

export { runSeed };
