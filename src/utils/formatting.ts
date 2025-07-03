export class FormattingUtils {
  static formatCurrency(amount: number, locale: string = 'ja-JP', currency: string = 'JPY'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  static formatNumber(value: number, locale: string = 'ja-JP'): string {
    return new Intl.NumberFormat(locale).format(value);
  }

  static formatDecimal(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
  }

  static formatLargeNumber(value: number): string {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  }

  static formatMonths(months: number): string {
    if (months < 1) {
      return '1ヶ月未満';
    } else if (months < 12) {
      return `${Math.ceil(months)}ヶ月`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = Math.ceil(months % 12);
      if (remainingMonths === 0) {
        return `${years}年`;
      } else {
        return `${years}年${remainingMonths}ヶ月`;
      }
    }
  }

  static formatDate(date: Date, locale: string = 'ja-JP'): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  static formatDateShort(date: Date, locale: string = 'ja-JP'): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  static capitalizeFirst(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}分`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}時間`;
      } else {
        return `${hours}時間${remainingMinutes}分`;
      }
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingMinutes = minutes % 1440;
      const hours = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      
      let result = `${days}日`;
      if (hours > 0) result += `${hours}時間`;
      if (mins > 0) result += `${mins}分`;
      
      return result;
    }
  }

  static formatCompactNumber(value: number): string {
    const formatter = new Intl.NumberFormat('ja-JP', {
      notation: 'compact',
      compactDisplay: 'short'
    });
    return formatter.format(value);
  }

  static formatRange(min: number, max: number, formatter: (value: number) => string): string {
    if (min === max) {
      return formatter(min);
    }
    return `${formatter(min)} - ${formatter(max)}`;
  }

  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return phoneNumber;
  }

  static formatCurrencyCompact(amount: number): string {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}億円`;
    } else if (amount >= 10000) {
      return `${(amount / 10000).toFixed(1)}万円`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}千円`;
    }
    return `${amount}円`;
  }
}