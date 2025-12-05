const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RideRepository {
  async create(data) {
    return await prisma.ride.create({
      data: {
        driverId: data.driverId,
        type: data.type,
        origin: data.origin,
        destination: data.destination,
        meetingPoint: data.meetingPoint,
        departureTime: new Date(data.departureTime),
        availableSeats: data.availableSeats,
        description: data.description
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            course: true,
            photoUrl: true
          }
        }
      }
    });
  }

  async findAll(filters = {}) {
    const where = {
      status: 'ACTIVE',
      departureTime: {
        gte: new Date() // Apenas caronas futuras
      }
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.destination) {
      where.destination = {
        contains: filters.destination,
        mode: 'insensitive'
      };
    }

    if (filters.date) {
      const date = new Date(filters.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      where.departureTime = {
        gte: date,
        lt: nextDay
      };
    }

    return await prisma.ride.findMany({
      where,
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            course: true,
            photoUrl: true
          }
        },
        _count: {
          select: {
            requests: {
              where: { status: 'ACCEPTED' }
            }
          }
        }
      },
      orderBy: {
        departureTime: 'asc'
      }
    });
  }

  async findById(id) {
    return await prisma.ride.findUnique({
      where: { id },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            course: true,
            photoUrl: true
          }
        },
        requests: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                photoUrl: true
              }
            }
          }
        }
      }
    });
  }

  async findByDriverId(driverId) {
    return await prisma.ride.findMany({
      where: { driverId },
      include: {
        _count: {
          select: {
            requests: {
              where: { status: 'ACCEPTED' }
            }
          }
        }
      },
      orderBy: {
        departureTime: 'desc'
      }
    });
  }

  async update(id, data) {
    return await prisma.ride.update({
      where: { id },
      data: {
        origin: data.origin,
        destination: data.destination,
        meetingPoint: data.meetingPoint,
        departureTime: data.departureTime ? new Date(data.departureTime) : undefined,
        availableSeats: data.availableSeats,
        description: data.description,
        status: data.status
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async delete(id) {
    return await prisma.ride.delete({
      where: { id }
    });
  }
}

module.exports = new RideRepository();