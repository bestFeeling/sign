module.exports = function(seq,dataTypes) {
      return sign = seq.define('sign', {
            id: {
                  type: dataTypes.INTEGER(11),
                  allowNull: false,
                  primaryKey: true,
                  autoIncrement: true
            },
            user_id: {
                  type: dataTypes.STRING,
                  allnowNull: true
            },
            shop_id: {
                  type: dataTypes.STRING,
                  allnowNull: true
            },
            created_at: {
                  type: dataTypes.DATE,
                  allowNull: true,
                  defaultValue: new Date()
            },
            created_by: {
                  type: dataTypes.INTEGER,
                  allnowNull: true
            }
      }, {
          timestamps: false,
          tableName: 'sign',
          freezeTableName: true
        })
}