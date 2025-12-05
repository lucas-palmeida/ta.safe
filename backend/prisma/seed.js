const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.rideRequest.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Dados antigos removidos');

  // Hash padrão para todas as senhas (senha123)
  const hashedPassword = await bcrypt.hash('senha123', 10);

  // Criar usuários
  const maria = await prisma.user.create({
    data: {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@poa.ifrs.edu.br',
      password: hashedPassword,
      role: 'STAFF',
      course: 'Servidora - Coordenação de TI'
    }
  });

  const pedro = await prisma.user.create({
    data: {
      name: 'Pedro Santos',
      email: 'pedro.santos@poa.ifrs.edu.br',
      password: hashedPassword,
      role: 'STUDENT',
      course: 'Análise e Desenvolvimento de Sistemas - 3º Sem'
    }
  });

  const ana = await prisma.user.create({
    data: {
      name: 'Ana Paula Silva',
      email: 'ana.silva@poa.ifrs.edu.br',
      password: hashedPassword,
      role: 'STUDENT',
      course: 'Sistemas para Internet - 2º Sem'
    }
  });

  const carlos = await prisma.user.create({
    data: {
      name: 'Carlos Eduardo',
      email: 'carlos.eduardo@poa.ifrs.edu.br',
      password: hashedPassword,
      role: 'STUDENT',
      course: 'ADS - 5º Sem'
    }
  });

  console.log('✅ Usuários criados:', {
    maria: maria.email,
    pedro: pedro.email,
    ana: ana.email,
    carlos: carlos.email
  });

  // Criar caronas
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(22, 30, 0, 0);

  const ride1 = await prisma.ride.create({
    data: {
      driverId: maria.id,
      type: 'CAR',
      origin: 'IFRS Campus Porto Alegre - Rua Ramiro Barcelos',
      destination: 'Bairro Floresta',
      meetingPoint: 'Portaria Principal',
      departureTime: tomorrow,
      availableSeats: 3,
      description: 'Honda Civic, ar condicionado. Saindo logo após a última aula!',
      status: 'ACTIVE'
    }
  });

  const ride2 = await prisma.ride.create({
    data: {
      driverId: carlos.id,
      type: 'MOTORCYCLE',
      origin: 'IFRS Campus Porto Alegre',
      destination: 'Estação São Pedro',
      meetingPoint: 'Estacionamento de motos',
      departureTime: tomorrow,
      availableSeats: 1,
      description: 'Moto Honda CG. Um capacete extra disponível.',
      status: 'ACTIVE'
    }
  });

  const ride3 = await prisma.ride.create({
    data: {
      driverId: maria.id,
      type: 'GROUP',
      origin: 'IFRS Campus Porto Alegre',
      destination: 'Parada Av. João Pessoa',
      meetingPoint: 'Portaria dos Fundos',
      departureTime: tomorrow,
      description: 'Grupo para ir caminhando até a parada. Todos bem-vindos!',
      status: 'ACTIVE'
    }
  });

  const afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(afterTomorrow.getDate() + 1);

  const ride4 = await prisma.ride.create({
    data: {
      driverId: carlos.id,
      type: 'SHARED_UBER',
      origin: 'IFRS Campus Porto Alegre',
      destination: 'Zona Norte',
      meetingPoint: 'Portaria Principal',
      departureTime: afterTomorrow,
      availableSeats: 2,
      description: 'Vou chamar Uber, podemos dividir. Rumo à Zona Norte.',
      status: 'ACTIVE'
    }
  });

  console.log('✅ Caronas criadas:', {
    ride1: `${ride1.type} - ${ride1.destination}`,
    ride2: `${ride2.type} - ${ride2.destination}`,
    ride3: `${ride3.type} - ${ride3.destination}`,
    ride4: `${ride4.type} - ${ride4.destination}`
  });

  // Criar algumas solicitações
  const request1 = await prisma.rideRequest.create({
    data: {
      rideId: ride1.id,
      userId: pedro.id,
      message: 'Olá Maria! Posso ir na sua carona? Moro na Floresta também 😊',
      status: 'ACCEPTED'
    }
  });

  const request2 = await prisma.rideRequest.create({
    data: {
      rideId: ride1.id,
      userId: ana.id,
      message: 'Oi! Ainda tem vaga? Preciso ir até a Floresta.',
      status: 'PENDING'
    }
  });

  const request3 = await prisma.rideRequest.create({
    data: {
      rideId: ride2.id,
      userId: pedro.id,
      message: 'Carlos, posso ir na moto? Nunca andei mas quero tentar haha',
      status: 'PENDING'
    }
  });

  console.log('✅ Solicitações criadas:', {
    request1: 'Pedro -> Carona da Maria (ACEITA)',
    request2: 'Ana -> Carona da Maria (PENDENTE)',
    request3: 'Pedro -> Moto do Carlos (PENDENTE)'
  });

  // Criar notificações
  await prisma.notification.create({
    data: {
      userId: maria.id,
      type: 'RIDE_REQUEST',
      title: 'Nova solicitação de carona',
      message: 'Pedro Santos solicitou sua carona para Bairro Floresta',
      read: false
    }
  });

  await prisma.notification.create({
    data: {
      userId: pedro.id,
      type: 'REQUEST_ACCEPTED',
      title: 'Solicitação aceita!',
      message: 'Maria Oliveira aceitou sua solicitação de carona',
      read: false
    }
  });

  console.log('✅ Notificações criadas');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Resumo:');
  console.log('   - 4 usuários criados');
  console.log('   - 4 caronas ativas');
  console.log('   - 3 solicitações (1 aceita, 2 pendentes)');
  console.log('   - 2 notificações');
  console.log('\n🔑 Todos os usuários têm a senha: senha123');
  console.log('\n📧 Emails:');
  console.log('   - maria.oliveira@poa.ifrs.edu.br (Motorista - STAFF)');
  console.log('   - pedro.santos@poa.ifrs.edu.br (Passageiro - STUDENT)');
  console.log('   - ana.silva@poa.ifrs.edu.br (Passageiro - STUDENT)');
  console.log('   - carlos.eduardo@poa.ifrs.edu.br (Motorista - STUDENT)');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });