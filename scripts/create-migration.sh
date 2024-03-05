#!/usr/bin/env bash
set -e

TEMPLATE="""import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => {

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: DataTypes.INTEGER });
     */
  },

  down: async (queryInterface: QueryInterface) => {

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}"""

function usage {
  cat <<EOF
Usage: create-migration.sh -m <migrations-path> -n <name>
  -m | --migrations-path  migrations directory path
  -n | --name             name of migration
  -h | --help         print usage
EOF
  }

while true; do
  case $1 in
    -m | --migrations-path) MIGRATIONS_PATH=$2; shift 2 ;;
    -n | --name) NAME=$2; shift 2;;
    -h | --help) usage; exit 0;;
    *) break;;
  esac
done

if [ -z $MIGRATIONS_PATH ] || [ -z $NAME ]; then
  usage
  exit 1
fi

TIMESTAMP=$(date +%s)

echo "${TEMPLATE}" > "${MIGRATIONS_PATH}/${TIMESTAMP}-${NAME}.ts"
