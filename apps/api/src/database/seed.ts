import { AppDataSource } from '../config/typeorm.config';
import {
  User,
  UserRole,
  Permission,
  Board,
  BoardColumn,
  Swimlane,
  ClassService,
  Card,
} from '../entities';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const permissionRepository = AppDataSource.getRepository(Permission);
    const userRepository = AppDataSource.getRepository(User);
    const boardRepository = AppDataSource.getRepository(Board);
    const columnRepository = AppDataSource.getRepository(BoardColumn);
    const swimlaneRepository = AppDataSource.getRepository(Swimlane);
    const classServiceRepository = AppDataSource.getRepository(ClassService);
    const cardRepository = AppDataSource.getRepository(Card);

    // Create permissions
    const permissions = await permissionRepository.save([
      {
        name: 'create_board',
        description: 'Can create new boards',
      },
      {
        name: 'edit_board',
        description: 'Can edit existing boards',
      },
      {
        name: 'delete_board',
        description: 'Can delete boards',
      },
      {
        name: 'manage_users',
        description: 'Can manage user permissions',
      },
    ]);
    console.log('✅ Created permissions');

    // Create users
    const adminUser = await userRepository.save({
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      permissions: permissions,
    });

    await userRepository.save({
      email: 'user@example.com',
      name: 'Regular User',
      role: UserRole.USER,
      permissions: permissions.slice(0, 3),
    });
    console.log('✅ Created users');

    // Create a board
    const board = await boardRepository.save({
      name: 'Project Alpha',
      userId: adminUser.id,
    });
    console.log('✅ Created board');

    // Create columns
    const columns = await columnRepository.save([
      {
        boardId: board.id,
        name: 'To Do',
        order: 0,
      },
      {
        boardId: board.id,
        name: 'In Progress',
        order: 1,
      },
      {
        boardId: board.id,
        name: 'In Review',
        order: 2,
      },
      {
        boardId: board.id,
        name: 'Done',
        order: 3,
      },
    ]);
    console.log('✅ Created columns');

    // Create swimlanes
    const swimlanes = await swimlaneRepository.save([
      {
        boardId: board.id,
        name: 'Frontend',
        order: 0,
      },
      {
        boardId: board.id,
        name: 'Backend',
        order: 1,
      },
      {
        boardId: board.id,
        name: 'DevOps',
        order: 2,
      },
    ]);
    console.log('✅ Created swimlanes');

    // Create class services
    const classServices = await classServiceRepository.save([
      {
        boardId: board.id,
        name: 'Bug',
        color: '#ef4444',
      },
      {
        boardId: board.id,
        name: 'Feature',
        color: '#3b82f6',
      },
      {
        boardId: board.id,
        name: 'Improvement',
        color: '#10b981',
      },
    ]);
    console.log('✅ Created class services');

    // Create cards
    await cardRepository.save([
      {
        columnId: columns[0].id,
        swimlaneId: swimlanes[0].id,
        classServiceId: classServices[1].id,
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        position: 0,
      },
      {
        columnId: columns[0].id,
        swimlaneId: swimlanes[1].id,
        classServiceId: classServices[1].id,
        title: 'Create REST API endpoints',
        description: 'Implement CRUD operations for all entities',
        position: 1,
      },
      {
        columnId: columns[1].id,
        swimlaneId: swimlanes[0].id,
        classServiceId: classServices[0].id,
        title: 'Fix navigation bug',
        description: 'Navigation menu not responsive on mobile',
        position: 0,
      },
      {
        columnId: columns[2].id,
        swimlaneId: swimlanes[1].id,
        classServiceId: classServices[2].id,
        title: 'Optimize database queries',
        description: 'Add indexes and improve query performance',
        position: 0,
      },
      {
        columnId: columns[3].id,
        swimlaneId: swimlanes[2].id,
        classServiceId: classServices[1].id,
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated deployment',
        position: 0,
      },
    ]);
    console.log('✅ Created cards');

    console.log('🎉 Database seed completed successfully!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
