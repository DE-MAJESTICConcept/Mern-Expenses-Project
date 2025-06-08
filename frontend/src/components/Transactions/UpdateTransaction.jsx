
import React from 'react';
import { useParams } from 'react-router-dom';

const UpdateTransaction = () => {
  const { id } = useParams(); // Get the transaction ID from the URL

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', backgroundColor: '#f0f0f0', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Update Transaction</h2>
      <p style={{ textAlign: 'center', color: '#555' }}>
        This is the Update Transaction page for transaction ID: <strong style={{ color: '#007bff' }}>{id}</strong>
      </p>
      <p style={{ textAlign: 'center', color: '#555' }}>
        You will build your transaction update form here.
      </p>
      {/* Your actual update form for the transaction will go here */}
      {/* You'll need to fetch the transaction details using the 'id' */}
      {/* And then use a mutation to send updated data to your backend */}
    </div>
  );
};

export default UpdateTransaction;