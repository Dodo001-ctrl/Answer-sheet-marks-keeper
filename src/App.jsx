

// // Version @2

// import React, { useState, useRef, useEffect } from 'react';
// import { Camera, Download, Trash2, CheckCircle, AlertCircle, Edit } from 'lucide-react';
// import * as XLSX from 'xlsx';

// export default function AnswerSheetScanner() {
//   const [isScanning, setIsScanning] = useState(false);
//   const [scannedData, setScannedData] = useState([]);
//   const [currentScan, setCurrentScan] = useState({ name: '', rollNo: '', marks: '' });
//   const [status, setStatus] = useState('');
//   const [showManualEntry, setShowManualEntry] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   const startCamera = async () => {
//     try {
//       setStatus('Requesting camera access...');

//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         },
//         audio: false
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;

//         try {
//           await videoRef.current.play();
//           setIsScanning(true);
//           setStatus('✓ Camera ready! Click "Capture" to scan an answer sheet');
//         } catch (playError) {
//           setStatus('Error: Could not start video - ' + playError.message);
//         }
//       }
//     } catch (err) {
//       console.error('Camera error:', err);
//       if (err.name === 'NotAllowedError') {
//         setStatus('Error: Camera permission denied. Please allow camera access.');
//       } else if (err.name === 'NotFoundError') {
//         setStatus('Error: No camera found on this device.');
//       } else {
//         setStatus('Error: ' + err.message);
//       }
//     }
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => {
//         track.stop();
//       });
//       streamRef.current = null;
//     }

//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }

//     setIsScanning(false);
//     setStatus('');
//     setCapturedImage(null);
//     setShowManualEntry(false);
//   };

//   const captureFrame = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0);

//     const imageData = canvas.toDataURL('image/jpeg', 0.9);
//     setCapturedImage(imageData);
//     setShowManualEntry(true);
//     setStatus('📝 Image captured! Enter the student details below');
//   };

//   const handleInputChange = (field, value) => {
//     setCurrentScan(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const confirmScan = () => {
//     if (!currentScan.name || !currentScan.rollNo || !currentScan.marks) {
//       alert('Please fill in all fields (Name, Roll No, and Marks)');
//       return;
//     }

//     const isDuplicate = scannedData.some(item => item.rollNo === currentScan.rollNo);
//     if (!isDuplicate) {
//       setScannedData([...scannedData, { ...currentScan, id: Date.now(), image: capturedImage }]);

//       // Reset to camera view
//       setCurrentScan({ name: '', rollNo: '', marks: '' });
//       setCapturedImage(null);
//       setShowManualEntry(false);
//       setStatus('✓ Added to list! Capture next answer sheet');
//     } else {
//       setStatus('⚠ Roll number already exists in list');
//     }
//   };

//   const cancelCapture = () => {
//     setCapturedImage(null);
//     setShowManualEntry(false);
//     setCurrentScan({ name: '', rollNo: '', marks: '' });
//     setStatus('✓ Camera ready! Click "Capture" to scan an answer sheet');
//   };

//   const exportToExcel = () => {
//     if (scannedData.length === 0) {
//       alert('No data to export');
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(
//       scannedData.map(({ name, rollNo, marks }) => ({
//         'Student Name': name,
//         'Roll Number': rollNo,
//         'Marks': marks
//       }))
//     );

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Answer Sheets');
//     XLSX.writeFile(workbook, `answer_sheets_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const deleteEntry = (id) => {
//     setScannedData(scannedData.filter(item => item.id !== id));
//   };

//   const clearAll = () => {
//     if (confirm('Clear all scanned data?')) {
//       setScannedData([]);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
//             <h1 className="text-3xl font-bold flex items-center gap-3">
//               <Camera size={36} />
//               Answer Sheet Scanner
//             </h1>
//             <p className="mt-2 opacity-90">Capture and record student information</p>
//           </div>

//           <div className="p-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Camera Section */}
//               <div className="space-y-4">
//                 <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative">
//                   {!showManualEntry ? (
//                     <>
//                       <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className={`w-full h-full object-cover ${isScanning ? 'block' : 'hidden'}`}
//                       />
//                       {!isScanning && (
//                         <div className="absolute inset-0 flex items-center justify-center text-gray-400">
//                           <div className="text-center">
//                             <Camera size={64} className="mx-auto mb-4 opacity-50" />
//                             <p>Camera not active</p>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <img 
//                       src={capturedImage} 
//                       alt="Captured" 
//                       className="w-full h-full object-cover"
//                     />
//                   )}
//                 </div>
//                 <canvas ref={canvasRef} className="hidden" />

//                 <div className="flex gap-3">
//                   {!isScanning ? (
//                     <button
//                       onClick={startCamera}
//                       className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
//                     >
//                       <Camera size={20} />
//                       Start Camera
//                     </button>
//                   ) : !showManualEntry ? (
//                     <>
//                       <button
//                         onClick={captureFrame}
//                         className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
//                       >
//                         <Camera size={20} />
//                         Capture
//                       </button>
//                       <button
//                         onClick={stopCamera}
//                         className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition"
//                       >
//                         Stop
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       onClick={cancelCapture}
//                       className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition"
//                     >
//                       Cancel & Recapture
//                     </button>
//                   )}
//                 </div>

//                 {status && (
//                   <div className={`p-4 rounded-lg flex items-center gap-3 ${
//                     status.includes('✓') ? 'bg-green-50 text-green-800' :
//                     status.includes('📝') ? 'bg-blue-50 text-blue-800' :
//                     status.includes('⚠') ? 'bg-yellow-50 text-yellow-800' :
//                     status.includes('Error') ? 'bg-red-50 text-red-800' :
//                     'bg-blue-50 text-blue-800'
//                   }`}>
//                     {status.includes('✓') ? <CheckCircle size={20} /> : 
//                      status.includes('⚠') || status.includes('Error') ? <AlertCircle size={20} /> : 
//                      status.includes('📝') ? <Edit size={20} /> : null}
//                     <span className="font-medium text-sm">{status}</span>
//                   </div>
//                 )}

//                 {showManualEntry && (
//                   <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 space-y-3">
//                     <h3 className="font-bold text-blue-800 text-lg">Enter Student Details:</h3>
//                     <div className="space-y-3">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">
//                           Student Name *
//                         </label>
//                         <input
//                           type="text"
//                           value={currentScan.name}
//                           onChange={(e) => handleInputChange('name', e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Enter student name"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">
//                           Roll Number *
//                         </label>
//                         <input
//                           type="text"
//                           value={currentScan.rollNo}
//                           onChange={(e) => handleInputChange('rollNo', e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Enter roll number"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">
//                           Marks *
//                         </label>
//                         <input
//                           type="text"
//                           value={currentScan.marks}
//                           onChange={(e) => handleInputChange('marks', e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Enter marks"
//                         />
//                       </div>
//                     </div>
//                     <button
//                       onClick={confirmScan}
//                       className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
//                     >
//                       <CheckCircle size={20} />
//                       Add to List
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Data List Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-bold text-gray-800">
//                     Scanned Records ({scannedData.length})
//                   </h2>
//                   <div className="flex gap-2">
//                     {scannedData.length > 0 && (
//                       <>
//                         <button
//                           onClick={clearAll}
//                           className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition"
//                           title="Clear all"
//                         >
//                           <Trash2 size={20} />
//                         </button>
//                         <button
//                           onClick={exportToExcel}
//                           className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
//                         >
//                           <Download size={20} />
//                           Export Excel
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-y-auto space-y-3">
//                   {scannedData.length === 0 ? (
//                     <div className="text-center text-gray-400 py-12">
//                       <p>No records yet</p>
//                       <p className="text-sm mt-2">Start scanning to add data</p>
//                     </div>
//                   ) : (
//                     scannedData.map((item) => (
//                       <div
//                         key={item.id}
//                         className="bg-white p-4 rounded-lg shadow"
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <div className="space-y-1 flex-1">
//                             <p className="font-semibold text-gray-800">{item.name}</p>
//                             <p className="text-sm text-gray-600">Roll: {item.rollNo}</p>
//                             <p className="text-sm text-gray-600">Marks: {item.marks}</p>
//                           </div>
//                           <button
//                             onClick={() => deleteEntry(item.id)}
//                             className="text-red-600 hover:text-red-800 p-2"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                         {item.image && (
//                           <img 
//                             src={item.image} 
//                             alt="Answer sheet" 
//                             className="w-full h-24 object-cover rounded mt-2"
//                           />
//                         )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 bg-white rounded-lg p-4 text-sm text-gray-600">
//           <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
//           <ol className="list-decimal list-inside space-y-1">
//             <li>Click "Start Camera" and allow camera permission</li>
//             <li>Position the answer sheet clearly in the camera view</li>
//             <li>Click "Capture" to take a photo of the answer sheet</li>
//             <li>Enter the student's Name, Roll Number, and Marks manually</li>
//             <li>Click "Add to List" to save the record</li>
//             <li>Repeat for all answer sheets</li>
//             <li>Click "Export Excel" when finished to download the data</li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// }



// version3
  
import React, { useState, useRef, useEffect } from 'react';
// import { Camera, Download, Trash2, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { Camera, Download, Trash2, CheckCircle, AlertCircle, Edit, RefreshCw } from 'lucide-react';  // UPDATED (RefreshCw added)
import * as XLSX from 'xlsx';
import './App.css';

export default function AnswerSheetScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState([]);
  const [currentScan, setCurrentScan] = useState({ name: '', rollNo: '', marks: '' });
  const [status, setStatus] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  // const [cameraFacing, setCameraFacing] = useState("environment");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setStatus('Requesting camera access...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });


      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        try {
          await videoRef.current.play();
          setIsScanning(true);
          setStatus('✓ Camera ready! Click "Capture" to scan an answer sheet');
        } catch (playError) {
          setStatus('Error: Could not start video - ' + playError.message);
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setStatus('Error: Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setStatus('Error: No camera found on this device.');
      } else {
        setStatus('Error: ' + err.message);
      }
    }
  };

  // 
  const switchCamera = async () => {
    if (!isScanning) return;

    const newFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(newFacing);

    stopCamera();

    setTimeout(() => {
      startCamera();
    }, 300);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setStatus('');
    setCapturedImage(null);
    setShowManualEntry(false);


  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    setShowManualEntry(true);
    setStatus('📝 Image captured! Enter the student details below');
  };


  const handleInputChange = (field, value) => {
    setCurrentScan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const confirmScan = () => {
    if (!currentScan.name || !currentScan.rollNo || !currentScan.marks) {
      alert('Please fill in all fields (Name, Roll No, and Marks)');
      return;
    }

    const isDuplicate = scannedData.some(item => item.rollNo === currentScan.rollNo);
    if (!isDuplicate) {
      setScannedData([...scannedData, { ...currentScan, id: Date.now(), image: capturedImage }]);

      // Reset to camera view
      setCurrentScan({ name: '', rollNo: '', marks: '' });
      setCapturedImage(null);
      setShowManualEntry(false);
      setStatus('✓ Added to list! Capture next answer sheet');
    } else {
      setStatus('⚠ Roll number already exists in list');
    }
  };

  const cancelCapture = () => {
    setCapturedImage(null);
    setShowManualEntry(false);
    setCurrentScan({ name: '', rollNo: '', marks: '' });
    setStatus('✓ Camera ready! Click "Capture" to scan an answer sheet');
  };

  const exportToExcel = () => {
    if (scannedData.length === 0) {
      alert('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      scannedData.map(({ name, rollNo, marks }) => ({
        'Student Name': name,
        'Roll Number': rollNo,
        'Marks': marks
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Answer Sheets');
    XLSX.writeFile(workbook, `answer_sheets_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportWithImages = () => {
    if (scannedData.length === 0) {
      alert('No data to export');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Answer Sheets - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        h1 { color: #2563eb; text-align: center; }
        .record { background: white; margin: 20px auto; padding: 20px; max-width: 800px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .info { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #1f2937; margin-left: 10px; }
        img { max-width: 100%; height: auto; border-radius: 4px; margin-top: 10px; border: 2px solid #e5e7eb; }
        .record-number { background: #2563eb; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin-bottom: 10px; }
        @media print {
            .record { page-break-after: always; }
        }
    </style>
</head>
<body>
    <h1>📋 Answer Sheet Records - ${new Date().toLocaleDateString()}</h1>
    <p style="text-align: center; color: #6b7280;">Total Records: ${scannedData.length}</p>
    ${scannedData.map((item, index) => `
        <div class="record">
            <span class="record-number">Record #${index + 1}</span>
            <div class="info">
                <span class="label">Student Name:</span>
                <span class="value">${item.name}</span>
            </div>
            <div class="info">
                <span class="label">Roll Number:</span>
                <span class="value">${item.rollNo}</span>
            </div>
            <div class="info">
                <span class="label">Marks:</span>
                <span class="value">${item.marks}</span>
            </div>
            <div class="info">
                <span class="label">Captured Image:</span>
                <img src="${item.image}" alt="Answer sheet for ${item.name}">
            </div>
        </div>
    `).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `answer_sheets_with_images_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteEntry = (id) => {
    setScannedData(scannedData.filter(item => item.id !== id));
  };

  const clearAll = () => {
    if (confirm('Clear all scanned data?')) {
      setScannedData([]);
    }
  };

  return (
    <div className="scanner-container">
      <div className="scanner-wrapper">
        <div className="scanner-card">
          <div className="header">
            <h1 className="header-title">
              <Camera size={36} />
              Answer Sheet Scanner
            </h1>
            <p className="header-subtitle">Capture and record student information</p>
          </div>

          <div className="content">
            <div className="grid-layout">
              {/* Camera Section */}
              <div className="camera-section">
                <div className="video-container">
                  {!showManualEntry ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`video-element ${isScanning ? 'active' : 'inactive'}`}
                      />
                      {!isScanning && (
                        <div className="video-placeholder">
                          <div className="placeholder-content">
                            <Camera size={64} className="placeholder-icon" />
                            <p>Camera not active</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="captured-image"
                    />
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden-canvas" />

                <div className="button-group">
                  {!isScanning ? (
                    <button onClick={startCamera} className="btn btn-primary btn-full">
                      <Camera size={20} />
                      Start Camera
                    </button>
                  ) : !showManualEntry ? (
                    <>
                      <button onClick={captureFrame} className="btn btn-success btn-full">
                        <Camera size={20} />
                        Capture
                      </button>
                      <button onClick={stopCamera} className="btn btn-danger">
                        Stop
                      </button>
                       {/* NEW CAMERA SWITCH BUTTON */}
                      <button onClick={switchCamera} className="btn btn-secondary">
                        <RefreshCw size={18} />
                        Switch Camera
                       </button>
                    </>
                  ) : (
                    <button onClick={cancelCapture} className="btn btn-secondary btn-full">
                      Cancel & Recapture
                    </button>
                  )}
                </div>

                {status && (
                  <div className={`status-message ${status.includes('✓') ? 'status-success' :
                    status.includes('📝') ? 'status-info' :
                      status.includes('⚠') ? 'status-warning' :
                        status.includes('Error') ? 'status-error' :
                          'status-info'
                    }`}>
                    {status.includes('✓') ? <CheckCircle size={20} /> :
                      status.includes('⚠') || status.includes('Error') ? <AlertCircle size={20} /> :
                        status.includes('📝') ? <Edit size={20} /> : null}
                    <span className="status-text">{status}</span>
                  </div>
                )}

                {showManualEntry && (
                  <div className="entry-form">
                    <h3 className="form-title">Enter Student Details:</h3>
                    <div className="form-fields">
                      <div className="form-group">
                        <label className="form-label">Student Name *</label>
                        <input
                          type="text"
                          value={currentScan.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="form-input"
                          placeholder="Enter student name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Roll Number *</label>
                        <input
                          type="text"
                          value={currentScan.rollNo}
                          onChange={(e) => handleInputChange('rollNo', e.target.value)}
                          className="form-input"
                          placeholder="Enter roll number"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Marks *</label>
                        <input
                          type="text"
                          value={currentScan.marks}
                          onChange={(e) => handleInputChange('marks', e.target.value)}
                          className="form-input"
                          placeholder="Enter marks"
                        />
                      </div>
                    </div>
                    <button onClick={confirmScan} className="btn btn-success btn-full">
                      <CheckCircle size={20} />
                      Add to List
                    </button>
                  </div>
                )}
              </div>

              {/* Data List Section */}
              <div className="records-section">
                <div className="records-header">
                  <h2 className="records-title">
                    Scanned Records ({scannedData.length})
                  </h2>
                  <div className="records-actions">
                    {scannedData.length > 0 && (
                      <>
                        <button onClick={clearAll} className="btn btn-icon btn-danger-light" title="Clear all">
                          <Trash2 size={20} />
                        </button>
                        <button onClick={exportToExcel} className="btn btn-success-sm" title="Export data to Excel">
                          <Download size={20} />
                          Excel
                        </button>
                        <button onClick={exportWithImages} className="btn btn-primary-sm" title="Export with images as HTML">
                          <Download size={20} />
                          HTML
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="records-list">
                  {scannedData.length === 0 ? (
                    <div className="empty-state">
                      <p>No records yet</p>
                      <p className="empty-subtext">Start scanning to add data</p>
                    </div>
                  ) : (
                    scannedData.map((item) => (
                      <div key={item.id} className="record-card">
                        <div className="record-content">
                          <div className="record-info">
                            <p className="record-name">{item.name}</p>
                            <p className="record-detail">Roll: {item.rollNo}</p>
                            <p className="record-detail">Marks: {item.marks}</p>
                          </div>
                          <button onClick={() => deleteEntry(item.id)} className="btn-delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        {item.image && (
                          <details className="image-details">
                            <summary className="image-summary">View Image</summary>
                            <img src={item.image} alt="Answer sheet" className="record-image" />
                          </details>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="instructions-card">
          <h3 className="instructions-title">Instructions:</h3>
          <ol className="instructions-list">
            <li>Click "Start Camera" and allow camera permission</li>
            <li>Position the answer sheet clearly in the camera view</li>
            <li>Click "Capture" to take a photo of the answer sheet</li>
            <li>Enter the student's Name, Roll Number, and Marks manually</li>
            <li>Click "Add to List" to save the record (images are automatically saved)</li>
            <li>Repeat for all answer sheets</li>
            <li>Click "Excel" for spreadsheet data or "HTML" for complete records with images</li>
          </ol>

          <div className="export-info">
            <p className="export-info-title">💡 Export Options:</p>
            <ul className="export-info-list">
              <li><strong>Excel:</strong> Spreadsheet with names, roll numbers, and marks only</li>
              <li><strong>HTML:</strong> Complete document with all data AND captured images (recommended for archiving)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


// version4


// import React, { useState, useRef, useEffect } from 'react';
// import { Camera, Download, Trash2, CheckCircle, AlertCircle, Edit, RefreshCw } from 'lucide-react';  // UPDATED (RefreshCw added)
// import * as XLSX from 'xlsx';
// import './App.css';

// export default function AnswerSheetScanner() {
//   const [isScanning, setIsScanning] = useState(false);
//   const [scannedData, setScannedData] = useState([]);
//   const [currentScan, setCurrentScan] = useState({ name: '', rollNo: '', marks: '' });
//   const [status, setStatus] = useState('');
//   const [showManualEntry, setShowManualEntry] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);

//   const [cameraFacing, setCameraFacing] = useState("environment"); // NEW

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   const startCamera = async () => {
//     try {
//       setStatus('Requesting camera access...');

//       // UPDATED → cameraFacing included
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: cameraFacing, // UPDATED
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         },
//         audio: false
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;

//         try {
//           await videoRef.current.play();
//           setIsScanning(true);
//           setStatus('✓ Camera ready! Click "Capture" to scan an answer sheet');
//         } catch (playError) {
//           setStatus('Error: Could not start video - ' + playError.message);
//         }
//       }
//     } catch (err) {
//       console.error('Camera error:', err);
//       if (err.name === 'NotAllowedError') {
//         setStatus('Error: Camera permission denied. Please allow camera access.');
//       } else if (err.name === 'NotFoundError') {
//         setStatus('Error: No camera found on this device.');
//       } else {
//         setStatus('Error: ' + err.message);
//       }
//     }
//   };

//   // NEW — Camera switching
//   const switchCamera = async () => {
//     if (!isScanning) return;

//     const newFacing = cameraFacing === "environment" ? "user" : "environment";
//     setCameraFacing(newFacing);

//     stopCamera();

//     setTimeout(() => {
//       startCamera();
//     }, 300);
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => {
//         track.stop();
//       });
//       streamRef.current = null;
//     }

//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }

//     setIsScanning(false);
//     setStatus('');
//     setCapturedImage(null);
//     setShowManualEntry(false);
//   };

//   const captureFrame = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0);

//     const imageData = canvas.toDataURL('image/jpeg', 0.9);
//     setCapturedImage(imageData);
//     setShowManualEntry(true);
//     setStatus('📝 Image captured! Enter the student details below');
//   };

//   const handleInputChange = (field, value) => {
//     setCurrentScan(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const confirmScan = () => {
//     if (!currentScan.name || !currentScan.rollNo || !currentScan.marks) {
//       alert('Please fill in all fields (Name, Roll No, and Marks)');
//       return;
//     }

//     const isDuplicate = scannedData.some(item => item.rollNo === currentScan.rollNo);
//     if (!isDuplicate) {
//       setScannedData([...scannedData, { ...currentScan, id: Date.now(), image: capturedImage }]);

//       setCurrentScan({ name: '', rollNo: '', marks: '' });
//       setCapturedImage(null);
//       setShowManualEntry(false);
//       setStatus('✓ Added to list! Capture next answer sheet');
//     } else {
//       setStatus('⚠ Roll number already exists in list');
//     }
//   };

//   const cancelCapture = () => {
//     setCapturedImage(null);
//     setShowManualEntry(false);
//     setCurrentScan({ name: '', rollNo: '', marks: '' });
//     setStatus('✓ Camera ready! Click "Capture" to scan an answer sheet');
//   };

//   const exportToExcel = () => {
//     if (scannedData.length === 0) {
//       alert('No data to export');
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(
//       scannedData.map(({ name, rollNo, marks }) => ({
//         'Student Name': name,
//         'Roll Number': rollNo,
//         'Marks': marks
//       }))
//     );

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Answer Sheets');
//     XLSX.writeFile(workbook, `answer_sheets_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const exportWithImages = () => {
//     if (scannedData.length === 0) {
//       alert('No data to export');
//       return;
//     }

//     const htmlContent = `
// <!-- your existing HTML export code here -->
// `;
//   };

//   return (
//     <div className="scanner-container">
//       <div className="scanner-wrapper">
//         <div className="scanner-card">

//           <div className="header">
//             <h1 className="header-title">
//               <Camera size={36} />
//               Answer Sheet Scanner
//             </h1>
//             <p className="header-subtitle">Capture and record student information</p>
//           </div>

//           <div className="content">
//             <div className="grid-layout">

//               {/* Camera Section */}
//               <div className="camera-section">
//                 <div className="video-container">
//                   {!showManualEntry ? (
//                     <>
//                       <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className={`video-element ${isScanning ? 'active' : 'inactive'}`}
//                       />
//                       {!isScanning && (
//                         <div className="video-placeholder">
//                           <div className="placeholder-content">
//                             <Camera size={64} className="placeholder-icon" />
//                             <p>Camera not active</p>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <img src={capturedImage} alt="Captured" className="captured-image" />
//                   )}
//                 </div>

//                 <canvas ref={canvasRef} className="hidden-canvas" />

//                 <div className="button-group">

//                   {!isScanning ? (
//                     <button onClick={startCamera} className="btn btn-primary btn-full">
//                       <Camera size={18} />
//                       Start Camera
//                     </button>
//                   ) : !showManualEntry ? (
//                     <>
//                       <button onClick={captureFrame} className="btn btn-success btn-full">
//                         <Camera size={18} />
//                         Capture
//                       </button>

//                       {/* NEW CAMERA SWITCH BUTTON */}
//                       <button onClick={switchCamera} className="btn btn-secondary">
//                         <RefreshCw size={18} />
//                         Switch Camera
//                       </button>

//                       <button onClick={stopCamera} className="btn btn-danger">
//                         Stop
//                       </button>
//                     </>                  

                    
//                   ) : (
//                     <button onClick={cancelCapture} className="btn btn-secondary btn-full">
//                       Cancel & Recapture
//                     </button>
//                   )}
//                 </div>

//                 {status && (
//                   <div className={`status-message ${
//                     status.includes('✓') ? 'status-success' :
//                     status.includes('📝') ? 'status-info' :
//                     status.includes('⚠') ? 'status-warning' :
//                     status.includes('Error') ? 'status-error' :
//                     'status-info'
//                   }`}>
//                     {status.includes('✓') ? <CheckCircle size={20} /> :
//                      status.includes('⚠') || status.includes('Error') ? <AlertCircle size={20} /> :
//                      status.includes('📝') ? <Edit size={20} /> : null}
//                     <span className="status-text">{status}</span>
//                   </div>
//                 )}

//               </div>

//               {/* Data section continues… (unchanged) */}

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

