#!/bin/bash
set -e

echo "=== MongoDB Initialization Started ==="

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to start..."
until mongosh --host localhost --eval "print('MongoDB connection test')" > /dev/null 2>&1; do
  echo "MongoDB not ready yet, waiting..."
  sleep 2
done

echo "MongoDB is ready, proceeding with initialization..."

# Initialize database and collections WITH AUTHENTICATION
mongosh --host localhost -u admin -p admin --authenticationDatabase admin <<EOF
  // Switch to target database
  use Projekt;

  // Create required collections
  db.createCollection('pacjenci');
  db.createCollection('users'); 
  db.createCollection('measurements');

  print('Collections created successfully');
EOF

# Import JSON data using mongoimport WITH AUTHENTICATION
if [ -f "/docker-entrypoint-initdb.d/Sleep_health_and_lifestyle_dataset.json" ]; then
  echo "Importing patient data from JSON file..."

  # Use mongoimport with authentication credentials
  mongoimport --host localhost \
    --username admin \
    --password admin \
    --authenticationDatabase admin \
    --db Projekt \
    --collection pacjenci \
    --file /docker-entrypoint-initdb.d/Sleep_health_and_lifestyle_dataset.json \
    --jsonArray

  echo "Patient data imported successfully"

  # Create indexes after data import WITH AUTHENTICATION
  mongosh --host localhost -u admin -p admin --authenticationDatabase admin <<EOF
    use Projekt;

    db.pacjenci.createIndex({ PersonID: 1 });
    db.pacjenci.createIndex({ Location: 1 });

    print('Indexes created successfully');
EOF

  # Verify data was imported WITH AUTHENTICATION
  mongosh --host localhost -u admin -p admin --authenticationDatabase admin <<EOF
    use Projekt;

    var count = db.pacjenci.countDocuments();
    print('Total patients imported: ' + count);

    if (count > 0) {
      print('Sample patient record:');
      printjson(db.pacjenci.findOne());
    }
EOF

else
  echo "ERROR: Sleep_health_and_lifestyle_dataset.json not found in /docker-entrypoint-initdb.d/"
  echo "Please ensure the JSON file is properly mounted"
fi

echo "=== MongoDB Initialization Completed ==="