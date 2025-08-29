-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 24, 2025 at 08:31 PM
-- Server version: 10.6.22-MariaDB-cll-lve
-- PHP Version: 8.3.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tiengtrung_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `kz_news_categories`
--

CREATE TABLE `kz_news_categories` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `ordering` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime DEFAULT '0000-00-00 00:00:00',
  `created_by` int(11) DEFAULT 0,
  `updated_by` int(11) DEFAULT 0,
  `language` varchar(50) DEFAULT 'vi'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `kz_news_categories`
--

INSERT INTO `kz_news_categories` (`id`, `title`, `alias`, `parent_id`, `description`, `images`, `status`, `ordering`, `created_at`, `updated_at`, `created_by`, `updated_by`, `language`) VALUES
(1, 'Tin tức', 'tin-tuc', 0, '', '', 1, 0, '2018-10-30 14:50:45', '2018-10-30 14:50:45', 1, 0, 'vi'),
(2, 'Thư viện', 'thu-vien', 0, '', '', 1, 0, '2018-10-30 14:51:02', '2018-10-30 14:51:02', 1, 0, 'vi'),
(3, 'Giới thiệu', 'gioi-thieu', 0, '', '', 1, 0, '2018-10-30 23:26:10', '2018-10-30 23:26:10', 1, 0, 'vi'),
(4, 'Về trung tâm TTTD', 've-trung-tam-tttd', 3, '', '', 1, 1, '2018-10-30 23:26:38', '2018-10-30 23:26:38', 1, 0, 'vi'),
(5, 'Đội ngũ giáo viên', 'doi-ngu-giao-vien', 3, '', '', 1, 3, '2018-10-30 23:27:47', '2018-10-30 23:27:47', 1, 0, 'vi'),
(6, 'Cảm nhận học viên', 'cam-nhan-hoc-vien', 3, '', '', 1, 4, '2018-10-30 23:28:13', '2018-10-30 23:28:13', 1, 0, 'vi'),
(7, 'Từ vựng', 'tu-vung', 2, '', '', 1, 1, '2018-11-05 22:49:45', '2018-11-05 22:49:45', 1, 0, 'vi'),
(8, 'Giao tiếp', 'giao-tiep', 2, '', '', 1, 2, '2018-11-05 22:51:36', '2018-11-05 22:51:36', 1, 0, 'vi'),
(9, 'Ngữ pháp', 'ngu-phap', 2, '', '', 1, 3, '2018-11-05 22:52:03', '2018-11-05 22:52:03', 1, 0, 'vi'),
(10, 'Tài liệu hay', 'tai-lieu-hay', 2, '', '', 1, 4, '2018-11-05 22:52:17', '2018-11-05 22:52:17', 1, 0, 'vi'),
(11, 'HSK + TOCFL', 'hsk-tocfl', 2, '', '', 1, 5, '2018-11-05 22:52:47', '2018-11-05 22:52:47', 1, 0, 'vi'),
(12, 'Khóa học miễn phí', 'khoa-hoc-mien-phi', 0, '', '', 1, 1, '2018-11-05 22:53:10', '2018-11-05 22:53:10', 1, 0, 'vi'),
(13, 'Chia sẻ kinh nghiệm', 'chia-se-kinh-nghiem', 12, '', '', 1, 7, '2018-11-05 22:53:27', '2019-01-03 12:04:54', 1, 1, 'vi'),
(14, 'Giải trí', 'giai-tri', 2, '', '', 1, 6, '2018-11-05 23:55:48', '2018-11-05 23:55:48', 1, 0, 'vi'),
(15, 'Hoạt động tại trung tâm', 'hoat-dong-tai-trung-tam', 1, '', '', 1, 1, '2018-11-06 13:19:22', '2018-11-06 13:19:22', 1, 0, 'vi'),
(16, 'Tin tức chung', 'tin-tuc-chung', 1, '', '', 1, 2, '2018-11-06 13:19:34', '2018-11-06 13:19:34', 1, 0, 'vi'),
(17, 'Du học + Việc làm', 'du-hoc-viec-lam', 1, '', '', 1, 3, '2018-11-06 13:19:47', '2018-11-06 13:19:47', 1, 0, 'vi'),
(18, 'Sơ cấp', 'so-cap', 12, '', '', 1, 1, '2018-11-06 13:20:14', '2018-11-06 13:20:14', 1, 0, 'vi'),
(19, 'Trung cấp', 'trung-cap', 12, '', '', 1, 3, '2018-11-06 13:20:25', '2018-11-06 13:20:25', 1, 0, 'vi'),
(20, 'Giao tiếp', 'giao-tiep-2', 12, '', '', 1, 3, '2018-11-06 13:20:38', '2018-11-06 13:20:38', 1, 0, 'vi'),
(21, 'Bài học bổ sung', 'bai-hoc-bo-sung', 12, '', '', 1, 6, '2018-11-06 13:20:51', '2019-01-03 12:04:55', 1, 1, 'vi'),
(22, 'Chương trình đào tạo', 'chuong-trinh-dao-tao', 3, '', '', 1, 2, '2018-11-06 13:29:38', '2018-11-06 13:29:38', 1, 0, 'vi'),
(23, 'Tuyển dụng', 'tuyen-dung', 1, '', '', 1, 4, '2018-11-14 13:37:39', '2018-11-14 13:37:39', 1, 0, 'vi'),
(24, 'Giáo trình cơ bản', 'giao-trinh-co-ban', 12, '', '', 1, 4, '2019-01-03 12:04:05', '2019-01-03 12:04:05', 1, 0, 'vi'),
(25, 'Giáo trình du lịch', 'giao-trinh-du-lich', 12, '', '', 1, 5, '2019-01-03 12:04:22', '2019-01-03 12:04:22', 1, 0, 'vi');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kz_news_categories`
--
ALTER TABLE `kz_news_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `alias` (`alias`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kz_news_categories`
--
ALTER TABLE `kz_news_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
