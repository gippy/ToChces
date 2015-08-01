app.service('cropEXIF', [
  function() {
    var ExifTags, GPSTags, IptcFieldMap, StringValues, TiffTags, addEvent, base64ToArrayBuffer, debug, findEXIFinJPEG, findIPTCinJPEG, getImageData, getStringFromDB, imageHasData, objectURLToBlob, readEXIFData, readIPTCData, readTagValue, readTags;
    debug = false;
    ExifTags = this.Tags = {
      0x9000: 'ExifVersion',
      0xA000: 'FlashpixVersion',
      0xA001: 'ColorSpace',
      0xA002: 'PixelXDimension',
      0xA003: 'PixelYDimension',
      0x9101: 'ComponentsConfiguration',
      0x9102: 'CompressedBitsPerPixel',
      0x927C: 'MakerNote',
      0x9286: 'UserComment',
      0xA004: 'RelatedSoundFile',
      0x9003: 'DateTimeOriginal',
      0x9004: 'DateTimeDigitized',
      0x9290: 'SubsecTime',
      0x9291: 'SubsecTimeOriginal',
      0x9292: 'SubsecTimeDigitized',
      0x829A: 'ExposureTime',
      0x829D: 'FNumber',
      0x8822: 'ExposureProgram',
      0x8824: 'SpectralSensitivity',
      0x8827: 'ISOSpeedRatings',
      0x8828: 'OECF',
      0x9201: 'ShutterSpeedValue',
      0x9202: 'ApertureValue',
      0x9203: 'BrightnessValue',
      0x9204: 'ExposureBias',
      0x9205: 'MaxApertureValue',
      0x9206: 'SubjectDistance',
      0x9207: 'MeteringMode',
      0x9208: 'LightSource',
      0x9209: 'Flash',
      0x9214: 'SubjectArea',
      0x920A: 'FocalLength',
      0xA20B: 'FlashEnergy',
      0xA20C: 'SpatialFrequencyResponse',
      0xA20E: 'FocalPlaneXResolution',
      0xA20F: 'FocalPlaneYResolution',
      0xA210: 'FocalPlaneResolutionUnit',
      0xA214: 'SubjectLocation',
      0xA215: 'ExposureIndex',
      0xA217: 'SensingMethod',
      0xA300: 'FileSource',
      0xA301: 'SceneType',
      0xA302: 'CFAPattern',
      0xA401: 'CustomRendered',
      0xA402: 'ExposureMode',
      0xA403: 'WhiteBalance',
      0xA404: 'DigitalZoomRation',
      0xA405: 'FocalLengthIn35mmFilm',
      0xA406: 'SceneCaptureType',
      0xA407: 'GainControl',
      0xA408: 'Contrast',
      0xA409: 'Saturation',
      0xA40A: 'Sharpness',
      0xA40B: 'DeviceSettingDescription',
      0xA40C: 'SubjectDistanceRange',
      0xA005: 'InteroperabilityIFDPointer',
      0xA420: 'ImageUniqueID'
    };
    TiffTags = this.TiffTags = {
      0x0100: 'ImageWidth',
      0x0101: 'ImageHeight',
      0x8769: 'ExifIFDPointer',
      0x8825: 'GPSInfoIFDPointer',
      0xA005: 'InteroperabilityIFDPointer',
      0x0102: 'BitsPerSample',
      0x0103: 'Compression',
      0x0106: 'PhotometricInterpretation',
      0x0112: 'Orientation',
      0x0115: 'SamplesPerPixel',
      0x011C: 'PlanarConfiguration',
      0x0212: 'YCbCrSubSampling',
      0x0213: 'YCbCrPositioning',
      0x011A: 'XResolution',
      0x011B: 'YResolution',
      0x0128: 'ResolutionUnit',
      0x0111: 'StripOffsets',
      0x0116: 'RowsPerStrip',
      0x0117: 'StripByteCounts',
      0x0201: 'JPEGInterchangeFormat',
      0x0202: 'JPEGInterchangeFormatLength',
      0x012D: 'TransferFunction',
      0x013E: 'WhitePoint',
      0x013F: 'PrimaryChromaticities',
      0x0211: 'YCbCrCoefficients',
      0x0214: 'ReferenceBlackWhite',
      0x0132: 'DateTime',
      0x010E: 'ImageDescription',
      0x010F: 'Make',
      0x0110: 'Model',
      0x0131: 'Software',
      0x013B: 'Artist',
      0x8298: 'Copyright'
    };
    GPSTags = this.GPSTags = {
      0x0000: 'GPSVersionID',
      0x0001: 'GPSLatitudeRef',
      0x0002: 'GPSLatitude',
      0x0003: 'GPSLongitudeRef',
      0x0004: 'GPSLongitude',
      0x0005: 'GPSAltitudeRef',
      0x0006: 'GPSAltitude',
      0x0007: 'GPSTimeStamp',
      0x0008: 'GPSSatellites',
      0x0009: 'GPSStatus',
      0x000A: 'GPSMeasureMode',
      0x000B: 'GPSDOP',
      0x000C: 'GPSSpeedRef',
      0x000D: 'GPSSpeed',
      0x000E: 'GPSTrackRef',
      0x000F: 'GPSTrack',
      0x0010: 'GPSImgDirectionRef',
      0x0011: 'GPSImgDirection',
      0x0012: 'GPSMapDatum',
      0x0013: 'GPSDestLatitudeRef',
      0x0014: 'GPSDestLatitude',
      0x0015: 'GPSDestLongitudeRef',
      0x0016: 'GPSDestLongitude',
      0x0017: 'GPSDestBearingRef',
      0x0018: 'GPSDestBearing',
      0x0019: 'GPSDestDistanceRef',
      0x001A: 'GPSDestDistance',
      0x001B: 'GPSProcessingMethod',
      0x001C: 'GPSAreaInformation',
      0x001D: 'GPSDateStamp',
      0x001E: 'GPSDifferential'
    };
    StringValues = this.StringValues = {
      ExposureProgram: {
        0: 'Not defined',
        1: 'Manual',
        2: 'Normal program',
        3: 'Aperture priority',
        4: 'Shutter priority',
        5: 'Creative program',
        6: 'Action program',
        7: 'Portrait mode',
        8: 'Landscape mode'
      },
      MeteringMode: {
        0: 'Unknown',
        1: 'Average',
        2: 'CenterWeightedAverage',
        3: 'Spot',
        4: 'MultiSpot',
        5: 'Pattern',
        6: 'Partial',
        255: 'Other'
      },
      LightSource: {
        0: 'Unknown',
        1: 'Daylight',
        2: 'Fluorescent',
        3: 'Tungsten (incandescent light)',
        4: 'Flash',
        9: 'Fine weather',
        10: 'Cloudy weather',
        11: 'Shade',
        12: 'Daylight fluorescent (D 5700 - 7100K)',
        13: 'Day white fluorescent (N 4600 - 5400K)',
        14: 'Cool white fluorescent (W 3900 - 4500K)',
        15: 'White fluorescent (WW 3200 - 3700K)',
        17: 'Standard light A',
        18: 'Standard light B',
        19: 'Standard light C',
        20: 'D55',
        21: 'D65',
        22: 'D75',
        23: 'D50',
        24: 'ISO studio tungsten',
        255: 'Other'
      },
      Flash: {
        0x0000: 'Flash did not fire',
        0x0001: 'Flash fired',
        0x0005: 'Strobe return light not detected',
        0x0007: 'Strobe return light detected',
        0x0009: 'Flash fired, compulsory flash mode',
        0x000D: 'Flash fired, compulsory flash mode, return light not detected',
        0x000F: 'Flash fired, compulsory flash mode, return light detected',
        0x0010: 'Flash did not fire, compulsory flash mode',
        0x0018: 'Flash did not fire, auto mode',
        0x0019: 'Flash fired, auto mode',
        0x001D: 'Flash fired, auto mode, return light not detected',
        0x001F: 'Flash fired, auto mode, return light detected',
        0x0020: 'No flash function',
        0x0041: 'Flash fired, red-eye reduction mode',
        0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
        0x0047: 'Flash fired, red-eye reduction mode, return light detected',
        0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
        0x004D: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
        0x004F: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
        0x0059: 'Flash fired, auto mode, red-eye reduction mode',
        0x005D: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
        0x005F: 'Flash fired, auto mode, return light detected, red-eye reduction mode'
      },
      SensingMethod: {
        1: 'Not defined',
        2: 'One-chip color area sensor',
        3: 'Two-chip color area sensor',
        4: 'Three-chip color area sensor',
        5: 'Color sequential area sensor',
        7: 'Trilinear sensor',
        8: 'Color sequential linear sensor'
      },
      SceneCaptureType: {
        0: 'Standard',
        1: 'Landscape',
        2: 'Portrait',
        3: 'Night scene'
      },
      SceneType: {
        1: 'Directly photographed'
      },
      CustomRendered: {
        0: 'Normal process',
        1: 'Custom process'
      },
      WhiteBalance: {
        0: 'Auto white balance',
        1: 'Manual white balance'
      },
      GainControl: {
        0: 'None',
        1: 'Low gain up',
        2: 'High gain up',
        3: 'Low gain down',
        4: 'High gain down'
      },
      Contrast: {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard'
      },
      Saturation: {
        0: 'Normal',
        1: 'Low saturation',
        2: 'High saturation'
      },
      Sharpness: {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard'
      },
      SubjectDistanceRange: {
        0: 'Unknown',
        1: 'Macro',
        2: 'Close view',
        3: 'Distant view'
      },
      FileSource: {
        3: 'DSC'
      },
      Components: {
        0: '',
        1: 'Y',
        2: 'Cb',
        3: 'Cr',
        4: 'R',
        5: 'G',
        6: 'B'
      }
    };
    IptcFieldMap = {
      0x78: 'caption',
      0x6E: 'credit',
      0x19: 'keywords',
      0x37: 'dateCreated',
      0x50: 'byline',
      0x55: 'bylineTitle',
      0x7A: 'captionWriter',
      0x69: 'headline',
      0x74: 'copyright',
      0x0F: 'category'
    };
    addEvent = function(element, event, handler) {
      if (element.addEventListener) {
        element.addEventListener(event, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent('on' + event, handler);
      }
    };
    imageHasData = function(img) {
      return !!img.exifdata;
    };
    base64ToArrayBuffer = function(base64, contentType) {
      var binary, buffer, i, len, view;
      contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || '';
      base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
      binary = atob(base64);
      len = binary.length;
      buffer = new ArrayBuffer(len);
      view = new Uint8Array(buffer);
      i = 0;
      while (i < len) {
        view[i] = binary.charCodeAt(i);
        i++;
      }
      return buffer;
    };
    objectURLToBlob = function(url, callback) {
      var http;
      http = new XMLHttpRequest;
      http.open('GET', url, true);
      http.responseType = 'blob';
      http.onload = function(e) {
        if (this.status === 200 || this.status === 0) {
          callback(this.response);
        }
      };
      http.send();
    };
    getImageData = function(img, callback) {
      var arrayBuffer, fileReader, handleBinaryFile, http;
      handleBinaryFile = function(binFile) {
        var data, iptcdata;
        data = findEXIFinJPEG(binFile);
        iptcdata = findIPTCinJPEG(binFile);
        img.exifdata = data || {};
        img.iptcdata = iptcdata || {};
        if (callback) {
          callback.call(img);
        }
      };
      if (img.src) {
        if (/^data\:/i.test(img.src)) {
          arrayBuffer = base64ToArrayBuffer(img.src);
          handleBinaryFile(arrayBuffer);
        } else if (/^blob\:/i.test(img.src)) {
          fileReader = new FileReader;
          fileReader.onload = function(e) {
            handleBinaryFile(e.target.result);
          };
          objectURLToBlob(img.src, function(blob) {
            fileReader.readAsArrayBuffer(blob);
          });
        } else {
          http = new XMLHttpRequest;
          http.onload = function() {
            var fileReader;
            if (this.status === 200 || this.status === 0) {
              handleBinaryFile(http.response);
            } else {
              throw 'Could not load image';
            }
            http = null;
          };
          http.open('GET', img.src, true);
          http.responseType = 'arraybuffer';
          http.send(null);
        }
      } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
        fileReader = new FileReader;
        fileReader.onload = function(e) {
          if (debug) {
            console.log('Got file of length ' + e.target.result.byteLength);
          }
          handleBinaryFile(e.target.result);
        };
        fileReader.readAsArrayBuffer(img);
      }
    };
    findEXIFinJPEG = function(file) {
      var dataView, length, marker, offset;
      dataView = new DataView(file);
      if (debug) {
        console.log('Got file of length ' + file.byteLength);
      }
      if (dataView.getUint8(0) !== 0xFF || dataView.getUint8(1) !== 0xD8) {
        if (debug) {
          console.log('Not a valid JPEG');
        }
        return false;
      }
      offset = 2;
      length = file.byteLength;
      marker = void 0;
      while (offset < length) {
        if (dataView.getUint8(offset) !== 0xFF) {
          if (debug) {
            console.log('Not a valid marker at offset ' + offset + ', found: ' + dataView.getUint8(offset));
          }
          return false;
        }
        marker = dataView.getUint8(offset + 1);
        if (debug) {
          console.log(marker);
        }
        if (marker === 225) {
          if (debug) {
            console.log('Found 0xFFE1 marker');
          }
          return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);
        } else {
          offset += 2 + dataView.getUint16(offset + 2);
        }
      }
    };
    findIPTCinJPEG = function(file) {
      var dataView, isFieldSegmentStart, length, nameHeaderLength, offset, sectionLength, startOffset;
      dataView = new DataView(file);
      if (debug) {
        console.log('Got file of length ' + file.byteLength);
      }
      if (dataView.getUint8(0) !== 0xFF || dataView.getUint8(1) !== 0xD8) {
        if (debug) {
          console.log('Not a valid JPEG');
        }
        return false;
      }
      offset = 2;
      length = file.byteLength;
      isFieldSegmentStart = function(dataView, offset) {
        return dataView.getUint8(offset) === 0x38 && dataView.getUint8(offset + 1) === 0x42 && dataView.getUint8(offset + 2) === 0x49 && dataView.getUint8(offset + 3) === 0x4D && dataView.getUint8(offset + 4) === 0x04 && dataView.getUint8(offset + 5) === 0x04;
      };
      while (offset < length) {
        if (isFieldSegmentStart(dataView, offset)) {
          nameHeaderLength = dataView.getUint8(offset + 7);
          if (nameHeaderLength % 2 !== 0) {
            nameHeaderLength += 1;
          }
          if (nameHeaderLength === 0) {
            nameHeaderLength = 4;
          }
          startOffset = offset + 8 + nameHeaderLength;
          sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);
          return readIPTCData(file, startOffset, sectionLength);
          break;
        }
        offset++;
      }
    };
    readIPTCData = function(file, startOffset, sectionLength) {
      var data, dataSize, dataView, fieldName, fieldValue, segmentSize, segmentStartPos, segmentType;
      dataView = new DataView(file);
      data = {};
      fieldValue = void 0;
      fieldName = void 0;
      dataSize = void 0;
      segmentType = void 0;
      segmentSize = void 0;
      segmentStartPos = startOffset;
      while (segmentStartPos < startOffset + sectionLength) {
        if (dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos + 1) === 0x02) {
          segmentType = dataView.getUint8(segmentStartPos + 2);
          if (segmentType in IptcFieldMap) {
            dataSize = dataView.getInt16(segmentStartPos + 3);
            segmentSize = dataSize + 5;
            fieldName = IptcFieldMap[segmentType];
            fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
            if (data.hasOwnProperty(fieldName)) {
              if (data[fieldName] instanceof Array) {
                data[fieldName].push(fieldValue);
              } else {
                data[fieldName] = [data[fieldName], fieldValue];
              }
            } else {
              data[fieldName] = fieldValue;
            }
          }
        }
        segmentStartPos++;
      }
      return data;
    };
    readTags = function(file, tiffStart, dirStart, strings, bigEnd) {
      var entries, entryOffset, i, tag, tags;
      entries = file.getUint16(dirStart, !bigEnd);
      tags = {};
      entryOffset = void 0;
      tag = void 0;
      i = void 0;
      i = 0;
      while (i < entries) {
        entryOffset = dirStart + i * 12 + 2;
        tag = strings[file.getUint16(entryOffset, !bigEnd)];
        if (!tag && debug) {
          console.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd));
        }
        tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        i++;
      }
      return tags;
    };
    readTagValue = function(file, entryOffset, tiffStart, dirStart, bigEnd) {
      var denominator, n, numValues, numerator, offset, type, val, vals, valueOffset;
      type = file.getUint16(entryOffset + 2, !bigEnd);
      numValues = file.getUint32(entryOffset + 4, !bigEnd);
      valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart;
      offset = void 0;
      vals = void 0;
      val = void 0;
      n = void 0;
      numerator = void 0;
      denominator = void 0;
      switch (type) {
        case 1:
        case 7:
          if (numValues === 1) {
            return file.getUint8(entryOffset + 8, !bigEnd);
          } else {
            offset = numValues > 4 ? valueOffset : entryOffset + 8;
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getUint8(offset + n);
              n++;
            }
            return vals;
          }
          break;
        case 2:
          offset = numValues > 4 ? valueOffset : entryOffset + 8;
          return getStringFromDB(file, offset, numValues - 1);
        case 3:
          if (numValues === 1) {
            return file.getUint16(entryOffset + 8, !bigEnd);
          } else {
            offset = numValues > 2 ? valueOffset : entryOffset + 8;
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
              n++;
            }
            return vals;
          }
          break;
        case 4:
          if (numValues === 1) {
            return file.getUint32(entryOffset + 8, !bigEnd);
          } else {
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
              n++;
            }
            return vals;
          }
          break;
        case 5:
          if (numValues === 1) {
            numerator = file.getUint32(valueOffset, !bigEnd);
            denominator = file.getUint32(valueOffset + 4, !bigEnd);
            val = new Number(numerator / denominator);
            val.numerator = numerator;
            val.denominator = denominator;
            return val;
          } else {
            vals = [];
            n = 0;
            while (n < numValues) {
              numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
              denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
              vals[n] = new Number(numerator / denominator);
              vals[n].numerator = numerator;
              vals[n].denominator = denominator;
              n++;
            }
            return vals;
          }
          break;
        case 9:
          if (numValues === 1) {
            return file.getInt32(entryOffset + 8, !bigEnd);
          } else {
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
              n++;
            }
            return vals;
          }
          break;
        case 10:
          if (numValues === 1) {
            return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
          } else {
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
              n++;
            }
            return vals;
          }
      }
    };
    getStringFromDB = function(buffer, start, length) {
      var n, outstr;
      outstr = '';
      n = start;
      while (n < start + length) {
        outstr += String.fromCharCode(buffer.getUint8(n));
        n++;
      }
      return outstr;
    };
    readEXIFData = function(file, start) {
      var bigEnd, exifData, firstIFDOffset, gpsData, tag, tags, tiffOffset;
      if (getStringFromDB(file, start, 4) !== 'Exif') {
        if (debug) {
          console.log('Not valid EXIF data! ' + getStringFromDB(file, start, 4));
        }
        return false;
      }
      bigEnd = void 0;
      tags = void 0;
      tag = void 0;
      exifData = void 0;
      gpsData = void 0;
      tiffOffset = start + 6;
      if (file.getUint16(tiffOffset) === 0x4949) {
        bigEnd = false;
      } else if (file.getUint16(tiffOffset) === 0x4D4D) {
        bigEnd = true;
      } else {
        if (debug) {
          console.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)');
        }
        return false;
      }
      if (file.getUint16(tiffOffset + 2, !bigEnd) !== 0x002A) {
        if (debug) {
          console.log('Not valid TIFF data! (no 0x002A)');
        }
        return false;
      }
      firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
      if (firstIFDOffset < 0x00000008) {
        if (debug) {
          console.log('Not valid TIFF data! (First offset less than 8)', file.getUint32(tiffOffset + 4, !bigEnd));
        }
        return false;
      }
      tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);
      if (tags.ExifIFDPointer) {
        exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
        for (tag in exifData) {
          tag = tag;
          switch (tag) {
            case 'LightSource':
            case 'Flash':
            case 'MeteringMode':
            case 'ExposureProgram':
            case 'SensingMethod':
            case 'SceneCaptureType':
            case 'SceneType':
            case 'CustomRendered':
            case 'WhiteBalance':
            case 'GainControl':
            case 'Contrast':
            case 'Saturation':
            case 'Sharpness':
            case 'SubjectDistanceRange':
            case 'FileSource':
              exifData[tag] = StringValues[tag][exifData[tag]];
              break;
            case 'ExifVersion':
            case 'FlashpixVersion':
              exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
              break;
            case 'ComponentsConfiguration':
              exifData[tag] = StringValues.Components[exifData[tag][0]] + StringValues.Components[exifData[tag][1]] + StringValues.Components[exifData[tag][2]] + StringValues.Components[exifData[tag][3]];
          }
          tags[tag] = exifData[tag];
        }
      }
      if (tags.GPSInfoIFDPointer) {
        gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
        for (tag in gpsData) {
          tag = tag;
          switch (tag) {
            case 'GPSVersionID':
              gpsData[tag] = gpsData[tag][0] + '.' + gpsData[tag][1] + '.' + gpsData[tag][2] + '.' + gpsData[tag][3];
          }
          tags[tag] = gpsData[tag];
        }
      }
      return tags;
    };
    this.getData = function(img, callback) {
      if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) {
        return false;
      }
      if (!imageHasData(img)) {
        getImageData(img, callback);
      } else {
        if (callback) {
          callback.call(img);
        }
      }
      return true;
    };
    this.getTag = function(img, tag) {
      if (!imageHasData(img)) {
        return;
      }
      return img.exifdata[tag];
    };
    this.getAllTags = function(img) {
      var a, data, tags;
      if (!imageHasData(img)) {
        return {};
      }
      a = void 0;
      data = img.exifdata;
      tags = {};
      for (a in data) {
        a = a;
        if (data.hasOwnProperty(a)) {
          tags[a] = data[a];
        }
      }
      return tags;
    };
    this.pretty = function(img) {
      var a, data, strPretty;
      if (!imageHasData(img)) {
        return '';
      }
      a = void 0;
      data = img.exifdata;
      strPretty = '';
      for (a in data) {
        a = a;
        if (data.hasOwnProperty(a)) {
          if (typeof data[a] === 'object') {
            if (data[a] instanceof Number) {
              strPretty += a + ' : ' + data[a] + ' [' + data[a].numerator + '/' + data[a].denominator + ']\r\n';
            } else {
              strPretty += a + ' : [' + data[a].length + ' values]\r\n';
            }
          } else {
            strPretty += a + ' : ' + data[a] + '\r\n';
          }
        }
      }
      return strPretty;
    };
    this.readFromBinaryFile = function(file) {
      return findEXIFinJPEG(file);
    };
  }
]);
