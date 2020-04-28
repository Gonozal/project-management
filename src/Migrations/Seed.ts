import { Sequelize } from 'sequelize-typescript';
import { User } from '../Models/User';
import { Project } from '../Models/Project';
import { Task } from '../Models/Task';
import { Tag } from '../Models/Tag';

export default class Seed {
  public static async up() {
    const users = await Promise.all([
      User.create({ name: 'admin', password: 'admin' }),
      User.create({ name: 'user', password: 'user' })
    ]);

    const projects = await Promise.all([
      Project.create({ name: 'Admin Project', leadId: users[0].id }),
      Project.create({ name: 'User Project', leadId: users[1].id }),
      Project.create({ name: 'Generic Project' })
    ]);

    projects[0].$set('lead', users[0]);
    projects[1].$set('lead', users[1]);

    await Promise.all(projects.map(project => project.save()));

    const tags = await Promise.all([
      Tag.create({ name: 'Authentication', color: '#151515' }),
      Tag.create({ name: 'Authorization', color: '#454545' }),
      Tag.create({ name: 'Tasks', color: '#AE1212' }),
      Tag.create({ name: 'Management', color: '#AE25AE' }),
      Tag.create({ name: 'UI', color: '#25AEAE' }),
      Tag.create({ name: 'Database', color: '#25AE25' })
    ]);

    const tasks = await Promise.all([
      Task.create({
        name: 'User Login',
        projectId: projects[0].id,
        sequence: 1
      }),
      Task.create({
        name: 'User Registration',
        projectId: projects[0].id,
        sequence: 2
      }),
      Task.create({
        name: 'User Interface',
        projectId: projects[0].id,
        sequence: 3
      }),
      Task.create({
        name: 'User Permissions',
        projectId: projects[0].id,
        sequence: 4
      }),
      Task.create({
        name: 'User Management',
        projectId: projects[0].id,
        sequence: 5
      })
    ]);

    tasks[0].$set('tags', [tags[0]]);
    tasks[0].$set('assignedTo', users[0]);

    tasks[1].$set('tags', [tags[0], tags[5]]);
    tasks[1].$set('assignedTo', users[0]);

    tasks[2].$set('tags', [tags[3], tags[4]]);
    tasks[2].$set('assignedTo', users[1]);

    tasks[3].$set('tags', [tags[1], tags[3], tags[5]]);

    tasks[4].$set('tags', [tags[1], tags[3], tags[4]]);
  }
}
