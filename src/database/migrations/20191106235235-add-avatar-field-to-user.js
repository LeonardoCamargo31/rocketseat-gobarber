module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      // referencia para files
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE', // sempre que atualiozar
      onDelete: 'SET NULL', // sempre que deletar
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
