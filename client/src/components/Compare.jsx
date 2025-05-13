import React from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { FaDownload, FaImage, FaEnvelope } from 'react-icons/fa';

const Compare = ({ selected = [], onRemove }) => {
  if (!selected.length) {
    return (
      <p className="text-yellow-200 text-center text-xl py-10">
        No properties selected for comparison.
      </p>
    );
  }

  // Function to download the table as CSV
  const downloadCSV = () => {
    const header = ['Property', 'Price', 'Location', 'Bedrooms', 'Bathrooms', 'Square Footage', 'Parking', 'Furnished'];
    const rows = selected.map((listing) => [
      listing.name,
      listing.offer
        ? `$${listing.discountPrice?.toLocaleString('en-US')}`
        : `$${listing.regularPrice?.toLocaleString('en-US')}`,
      listing.address || 'N/A',
      listing.bedrooms ?? 'N/A',
      listing.bathrooms ?? 'N/A',
      listing.squareFootage || 'N/A',
      listing.parking ? 'Yes' : 'No',
      listing.furnished ? 'Yes' : 'No',
    ]);

    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'comparison_table.csv');
  };

  // Function to save the table as an image
  const saveAsImage = () => {
    const table = document.getElementById('compare-table');
    html2canvas(table).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'comparison_table.png';
      link.click();
    });
  };

  // Function to share via email
  const shareViaEmail = () => {
    const table = document.getElementById('compare-table');
    const tableHtml = table.outerHTML;
    const emailBody = encodeURIComponent(`
      <h3>Property Comparison</h3>
      ${tableHtml}
    `);
    const mailtoLink = `mailto:?subject=Property Comparison&body=${emailBody}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="compare-table bg-gradient-to-br from-blue-950 via-black to-black p-8 rounded-lg shadow-xl overflow-x-auto" id="compare-table">
      <h2 className="text-3xl font-semibold text-yellow-100 mb-6 text-center"> 🏢Compare Properties</h2>
      <table className="table-auto w-full text-left text-yellow-200">
        <thead className="bg-gradient-to-r from-blue-900 to-blue-950">
          <tr>
            <th className="text-lg font-medium p-4">Property</th>
            {selected.map((listing) => (
              <th key={listing._id} className="text-lg font-medium p-4">{listing.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Add Rows for Price, Location, etc. */}
          <tr className="border-b border-gray-700 hover:bg-blue-500 transition duration-200">
            <td className="p-4">Price</td>
            {selected.map((listing) => (
              <td key={listing._id} className="p-4">
                ${listing.offer
                  ? listing.discountPrice?.toLocaleString('en-US')
                  : listing.regularPrice?.toLocaleString('en-US')}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-700 hover:bg-blue-500 transition duration-200">
            <td className="p-4">Location</td>
            {selected.map((listing) => (
              <td key={listing._id} className="p-4">{listing.address || 'N/A'}</td>
            ))}
          </tr>
          <tr className="border-b border-gray-700 hover:bg-blue-500 transition duration-200">
            <td className="p-4">Bedrooms</td>
            {selected.map((listing) => (
              <td key={listing._id} className="p-4">{listing.bedrooms ?? 'N/A'}</td>
            ))}
          </tr>
          <tr className="border-b border-gray-700 hover:bg-blue-500 transition duration-200">
            <td className="p-4">Bathrooms</td>
            {selected.map((listing) => (
              <td key={listing._id} className="p-4">{listing.bathrooms ?? 'N/A'}</td>
            ))}
          </tr>
          <tr className="border-b border-gray-700 hover:bg-blue-500 transition duration-200">
            <td className="p-4">Square Footage</td>
            {selected.map((listing) => (
              <td key={listing._id} className="p-4">{listing.squareFootage || 'N/A'}</td>
            ))}
          </tr>
          <tr className="border-b border-gray-700 hover:bg-blue-500 transition duration-200">
            <td className="p-4">Parking</td>
            {selected.map((listing) => (
              <td key={listing._id} className="p-4">{listing.parking ? 'Yes' : 'No'}</td>
            ))}
          </tr>
          <tr className="border-b border-gray-700 hover:bg-blue-500 transition duration-200">
            <td className="p-4">Furnished</td>
            {selected.map((listing) => (
              <td key={listing._id} className="p-4">{listing.furnished ? 'Yes' : 'No'}</td>
            ))}
          </tr>

          {/* Remove Button */}
          <tr className="border-b border-gray-700 hover:bg-blue-500 transition duration-200">
            <td className="p-4">Remove</td>
            {selected.map((listing) => (
              <td key={listing._id} className="p-4">
                <button
                  onClick={() => onRemove(listing._id)}
                  className="bg-red-500 text-white py-1 px-4 rounded-full hover:bg-red-700 transition duration-300"
                >
                  Remove
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Buttons for CSV, Image, and Share */}
      <div className="mt-6 flex  justify-between space-x-4">
        <button
          onClick={downloadCSV}
          className="bg-yellow-500 text-black py-2 px-6 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300 flex items-center space-x-2"
        >
          <FaDownload />
          <span className="font-bold ">Download as CSV</span>
        </button>
        <button
          onClick={saveAsImage}
          className="bg-orange-400 text-black py-2 px-6 rounded-lg shadow-lg hover:bg-blue-400 transition duration-300 flex items-center space-x-2"
        >
          <FaImage />
          <span className="font-bold">Save as Image</span>
        </button>
        <button
          onClick={shareViaEmail}
          className="bg-green-500 text-black text-bold py-2 px-6 rounded-lg shadow-lg hover:bg-green-400 transition duration-300 flex items-center space-x-2"
        >
          <FaEnvelope />
          <span className="font-bold ">Share via Email</span>
        </button>
      </div>
    </div>
  );
};

export default Compare;
