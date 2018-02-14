pragma solidity ^0.4.0;
contract Book 
{
    struct Booking 
    {
        string rateCode;
        string status;
        address host;
    }
    
    struct Rate
    {
        string rateCode;
        string from;
        string to;
        uint price;
    }
    
    Booking[] bookings;
    Rate[] rates;

    function book(string rateCode, address host)
    {
        bookings.push(Booking(rateCode, "Booked", host));
    }
    
    function getBookingIndex() returns (uint256 len)
    {
        return bookings.length;
    }
    
    function getBookingByIndex(uint index) public constant returns(string,string, address)
    {
        return (bookings[index].rateCode, bookings[index].status, bookings[index].host);
    }
    
    function SaveRate(string rateCode, string from, string to, uint price)
    {
        rates.push(Rate(rateCode, from, to, price));
    }
    
    function getRatesIndex() returns (uint256 len)
    {
        return rates.length;
    }
    
    function getRateByIndex(uint index) public constant returns(string,string,string,uint)
    {
        return (rates[index].rateCode, rates[index].from, rates[index].to, rates[index].price);
    }
    
}