const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RequestRepository {
  async create(data) {
    return await prisma.rideRequest.create({
      data: {
        userId: data.userId,
        rideId: data.rideId,
        message: data.message
      },
      include: {
        ride: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            photoUrl: true
          }
        }
      }
    });
  }

  async findById(id) {
    return await prisma.rideRequest.findUnique({
      where: { id },
      include: {
        ride: {
          include: {
            driver: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            photoUrl: true
          }
        }
      }
    });
  }

  async findByUserId(userId) {
    return await prisma.rideRequest.findMany({
      where: { userId },
      include: {
        ride: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                email: true,
                photoUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findByUserAndRide(userId, rideId) {
    return await prisma.rideRequest.findUnique({
      where: {
        rideId_userId: {
          rideId,
          userId
        }
      }
    });
  }

  async updateStatus(id, status) {
    return await prisma.rideRequest.update({
      where: { id },
      data: { status },
      include: {
        ride: true,
        user: {
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
    return await prisma.rideRequest.delete({
      where: { id }
    });
  }
}

module.exports = new RequestRepository();