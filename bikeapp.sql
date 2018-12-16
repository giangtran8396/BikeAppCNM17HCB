	-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 16, 2018 lúc 11:47 AM
-- Phiên bản máy phục vụ: 10.1.36-MariaDB
-- Phiên bản PHP: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `bikeapp`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `request`
--

CREATE TABLE `request` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Phone` varchar(20) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Address` varchar(150) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Location1` varchar(250) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Location2` varchar(250) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Note` varchar(500) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Status` int(11) NOT NULL,
  `CreateDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `request`
--

INSERT INTO `request` (`Id`, `Name`, `Phone`, `Address`, `Location1`, `Location2`, `Note`, `Status`, `CreateDate`) VALUES
(1, 'giang', '0123456', '227 nvc q5', '{\"lat\":10.76142127010728,\"lng\":106.68046755}', NULL, 'note note note', 1, '2018-12-16 17:44:44'),
(2, 'test', '090344455', '227 nvc q5', '{\"lat\":10.76142127010728,\"lng\":106.68046755}', NULL, 'abc', 1, '2018-12-16 17:44:44'),
(3, 'test1', '090232323', '227 nvc q5', '{\"lat\":10.76142127010728,\"lng\":106.68046755}', NULL, '234324242', 1, '2018-12-16 17:44:44'),
(4, 'test2', '090344455', '227 nvc q5 / khtn', '{\"lat\":10.76147392010728,\"lng\":106.68085337010734}', NULL, 'test test test test', 1, '2018-12-16 17:44:44'),
(5, 'test4', '0404040404', '57 hung phu P8 ', '{\"lat\":10.74866967010728,\"lng\":106.67940982010737}', NULL, '44444444', 1, '2018-12-16 17:44:44'),
(6, 'test5', '123123', '1 hung phu p8 q8', '{\"lat\":10.74890147010728,\"lng\":106.68093387010731}', NULL, '123123', 1, '2018-12-16 17:44:44'),
(7, 'test 6', '090344455', '57 pham hung ', '{\"lat\":10.7904449197085,\"lng\":106.69708461970845}', NULL, 'nope', 1, '2018-12-16 17:44:44'),
(8, 'test 7', '123123', '100 phan xich long Q11', '{\"lat\":10.75433437010728,\"lng\":106.64512057010734}', NULL, '123123', 1, '2018-12-16 17:44:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `ID` int(11) NOT NULL,
  `UserName` varchar(100) COLLATE utf8_vietnamese_ci NOT NULL,
  `Password` varchar(250) COLLATE utf8_vietnamese_ci NOT NULL,
  `Name` varchar(250) COLLATE utf8_vietnamese_ci NOT NULL,
  `Role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`ID`, `UserName`, `Password`, `Name`, `Role`) VALUES
(1, 'kh1', '$2b$10$ryQilWlaO8mEI.naGokPL.tsrh995ReVgpbbpwc6NqQ3uTnQHyMPG', 'Khách hàng 1', 2),
(11, 'kh2', '$2b$10$cdnfoNIloDtz9CeBfgCuIuTnruDnOCMDldCY2f76URuFDoxjDqWPG', 'Khách hàng 2', 2),
(12, 'kh3', '$2b$10$MNXejcdahg.OzimwX2TAF.XmN/43GocXqUMGVjWga2mNdkXT2hUZa', 'Khách hàng 3', 2),
(13, 'kh4', '$2b$10$u/5zOQoy58q8.ueEaIyv3.2sROdKwHDBM1nLQimQ1lhjMb6RJehR.', 'Khách hàng 4', 2),
(14, 'kh5', '$2b$10$2MYXAFmzwHK3Uo9Npiibq.UlZCoAnflXPFOILK49tLXK55EUQRgR.', 'Khách hàng 5', 2),
(16, 'kh7', '$2b$10$3grlWipZs5n0SKRyCiUPZeCK1zcfv9mk4Yu3RubgcLl1QzMlbLyjK', 'Khách hàng 7', 2),
(17, 'kh6', '$2b$10$VbI.xK0RBBlxMjO1XUbM9.in5yQOwUHTbH6oi5rMebtSpiTg7vDzm', 'Khách hàng 6', 2),
(18, 'kh8', '$2b$10$chHXNRSFdPow13KJzmKJmenrshSg.9Xvn8S2n/1rX80Ai36i0K3hm', 'Khách hàng 8', 2),
(19, 'taixe1', '$2b$10$GLCSy6XNmBLBrkElhLqbmuc4di4Uoi9nxTAB3WWCcKgWw86.rwrBe', 'Tài xế 1', 3),
(20, 'taixe2', '$2b$10$8eex679WwBK3XUMrFzImPuExhuKhY.lPzu8wtpNIv0sx8FBcgCa9C', 'Tài xế 2', 3),
(21, 'taixe3', '$2b$10$RgqUqG/sd3GPv8muF9Dz5uomlYRRwpBRIXOc7m15vpNjr7e4xT9ea', 'Tài xế 3', 3),
(22, 'taixe4', '$2b$10$i9s5EcZH0m1xC2pA4QjsHeMxLc/K78wFBfAobxJT2SQRUyN8tDMaa', 'Tài xế 4', 3),
(23, 'taixe5', '$2b$10$NwqoicpuDlyKsdFKBMRMLOMrBqN6JRXCfLcWimrPTgZWm16u28Fne', 'Tài xế 5', 3),
(24, 'admin1', '$2b$10$mXzH4j7efC03gHWB4S.0NO3wf9dW.h4Mcs1wINeGB9/hD.XfJozUG', 'Quản trị 1', 1),
(25, 'admin2', '$2b$10$RM1EVj7YagpeTsyL6iuJxOWUnsMDsoYXV1NYlzjbzvb4N3Sz4SPUC', 'Quản trị 2', 1),
(26, 'admin3', '$2b$10$y9h5v.p8O1UWbH5.mE4qyOcDTYgQ2YO7JhREf8q5.ue4Ao5O0aqxK', 'Quản trị 3', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`Id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `request`
--
ALTER TABLE `request`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
