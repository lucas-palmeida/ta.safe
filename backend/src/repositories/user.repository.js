const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserRepository {
  async create(data) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || 'STUDENT',
        course: data.course,
        photoUrl: data.photoUrl
      }
    });
  }

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        course: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        course: data.course,
        photoUrl: data.photoUrl
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        course: true,
        photoUrl: true,
        updatedAt: true
      }
    });
  }

  async delete(id) {
    return await prisma.user.delete({
      where: { id }
    });
  }
}

module.exports = new UserRepository();