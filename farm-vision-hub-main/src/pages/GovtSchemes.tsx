const GovtSchemes = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        🇮🇳 Government Schemes for Farmers
      </h1>

      <ul className="space-y-4">
        <li className="p-4 border rounded-lg">
          <h2 className="font-semibold">PM-KISAN</h2>
          <p>₹6000 per year income support for farmers.</p>
          <a
            href="https://pmkisan.gov.in"
            target="_blank"
            className="text-blue-600 underline"
          >
            Official Website
          </a>
        </li>

        <li className="p-4 border rounded-lg">
          <h2 className="font-semibold">Pradhan Mantri Fasal Bima Yojana</h2>
          <p>Crop insurance scheme for natural calamities.</p>
          <a
            href="https://pmfby.gov.in"
            target="_blank"
            className="text-blue-600 underline"
          >
            Official Website
          </a>
        </li>

        <li className="p-4 border rounded-lg">
          <h2 className="font-semibold">Soil Health Card Scheme</h2>
          <p>Free soil testing and nutrient recommendations.</p>
          <a
            href="https://soilhealth.dac.gov.in"
            target="_blank"
            className="text-blue-600 underline"
          >
            Official Website
          </a>
        </li>
      </ul>
    </div>
  );
};

export default GovtSchemes;
