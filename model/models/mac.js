module.exports = function(seq,dataTypes) {
      return mac = seq.define('mac', {
		id: {
		    	type: dataTypes.INTEGER(11),
      		allowNull: false,
                  primaryKey: true,
                  autoIncrement: true
      	},
            shop_name: {
                  type: dataTypes.STRING,
                  allnowNull: true
            },
      	shop_id: {
      		type: dataTypes.STRING,
      		allnowNull: true
      	},
      	mac_address: {
      		type: dataTypes.STRING,
      		allnowNull: true
      	},
      	created_at: {
      		type: dataTypes.DATE,
      		allowNull: true,
                  defaultValue: new Date()
      	},
      	update_at: {
      		type: dataTypes.DATE,
      		allowNull: true
      	},
      	created_by: {
      		type: dataTypes.INTEGER,
      		allnowNull: true
      	}
	}, {
            timestamps: false,
            tableName: 'mac',
            freezeTableName: true
        })
}